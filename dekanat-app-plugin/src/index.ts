/**
 * This plugin allows us to run initialization (config, example data)
 * on starting up the core. We can also create methods to allow complex
 * tasks to be accomplished with only one network request. It may eventually
 * even be a security bonus to create highly specific methods and expose only
 * them for use by the front-end.
 */
import { readFileSync } from "fs"
import { randomBytes } from "crypto"
import { PluginLoader, CoreRequest, CoreResponse } from "@intutable/core"
import {
    Column,
    ColumnType,
    SimpleColumnOption,
} from "@intutable/database/dist/types"
import {
    openConnection,
    closeConnection,
    insert,
    select,
} from "@intutable/database/dist/requests"
import { removeColumn } from "@intutable/project-management/dist/requests"
import {
    types as lvt,
    requests as lvr,
    selectable,
} from "@intutable/lazy-views/"

import * as req from "./requests"
import { ATTRIBUTES as A, toSql } from "../../shared/dist/attributes"
import { error } from "./internal/error"
import * as perm from "./permissions/requests"

import { createExampleSchema, insertExampleData } from "./example/load"

let core: PluginLoader
// default credentials, if none are specified in the config:
const ADMIN_NAME = "admin@dekanat.de"
const ADMIN_PASSWORD = "password"
let adminId: number

export async function init(plugins: PluginLoader) {
    core = plugins

    const configText = readFileSync(`${__dirname}/../../shared/config.json`, {
        encoding: "utf8",
    })
    const configJson = JSON.parse(configText)
    const username: string = configJson.databaseAdminUsername
    const password: string = configJson.databaseAdminPassword
    if (typeof username !== "string" || typeof password !== "string") {
        // the error sometimes just causes silent failure
        console.log("error: database credentials not present in config file")
        throw TypeError("database credentials not present in config file")
    }

    const sessionID = "dekanat-app-plugin_" + randomBytes(20).toString("hex")

    await core.events.request(openConnection(sessionID, username, password))

    // in init.sql until db supports default values
    // await configureColumnAttributes()

    // create some custom data
    const maybeAdminId = await getAdminId(sessionID)
    if (maybeAdminId === null) {
        const username: string = configJson.appAdminUsername ?? ADMIN_NAME
        const password: string = configJson.appAdminPassword ?? ADMIN_PASSWORD
        adminId = await createAdmin(sessionID, username, password)
        console.log("set up admin user")
    } else {
        adminId = maybeAdminId
        console.log("admin user already present")
    }

    // testing data
    if (maybeAdminId === null) {
        console.log("creating and populating example schema")
        await createExampleSchema(core, sessionID, adminId)
        await insertExampleData(core, sessionID)
    } else console.log("skipped creating example schema")

    core.listenForRequests(req.CHANNEL)
        .on(req.addColumnToTable.name, addColumnToTable_)
        .on(req.addColumnToViews.name, addColumnToFilterViews_)
        .on(req.removeColumnFromTable.name, removeColumnFromTable_)
        .on(req.changeTableColumnAttributes.name, changeTableColumnAttributes_)
        .on(perm.getUsers.name, perm.getUsers_)
        .on(perm.getRoles.name, perm.getRoles_)
        .on(perm.createUser.name, perm.createUser_)
        .on(perm.deleteUser.name, perm.deleteUser_)
        .on(perm.changeRole.name, perm.changeRole_)

    await core.events.request(closeConnection(sessionID))
}

async function getAdminId(sessionID: string): Promise<number | null> {
    const userRows = await core.events.request(
        select(sessionID, "users", {
            columns: ["_id"],
            condition: ["email", ADMIN_NAME],
        })
    )
    if (userRows.length > 1)
        return Promise.reject("fatal: multiple users with same name exist")
    else if (userRows.length === 1) return userRows[0]["_id"]
    else return null
}

/** Create admin user */
async function createAdmin(
    sessionID: string,
    username: string,
    password: string
): Promise<number> {
    const passwordHash: string = await core.events
        .request({
            channel: "user-authentication",
            method: "hashPassword",
            password,
        })
        .then(response => response.hash)
    await core.events.request(
        insert(sessionID, "users", {
            email: username,
            password: passwordHash,
        })
    )
    return getAdminId(sessionID).then(definitelyNumber => definitelyNumber!)
}

/** Create the custom attributes for views' columns we need. */
async function configureColumnAttributes(sessionID: string): Promise<void> {
    const customColumns: Column[] = [
        {
            name: "displayName",
            type: ColumnType.text,
            options: [SimpleColumnOption.nullable],
        },
        {
            name: "userPrimary",
            type: ColumnType.integer,
            options: [SimpleColumnOption.notNullable],
        },
        {
            name: "editable",
            type: ColumnType.integer,
            options: [SimpleColumnOption.notNullable],
        },
        {
            name: "editor",
            type: ColumnType.text,
            options: [SimpleColumnOption.nullable],
        },
        {
            name: "formatter",
            type: ColumnType.text,
            options: [SimpleColumnOption.nullable],
        },
    ]
    await Promise.all(
        customColumns.map(c =>
            core.events.request(lvr.addColumnAttribute(sessionID, c))
        )
    )
}

//==================== core methods ==========================
async function addColumnToTable_({
    sessionID,
    tableId,
    column,
    joinId,
    createInViews,
}: CoreRequest): Promise<CoreResponse> {
    return addColumnToTable(sessionID, tableId, column, joinId, createInViews)
}
async function addColumnToTable(
    sessionID: string,
    tableId: lvt.ViewDescriptor["id"],
    column: lvt.ColumnSpecifier,
    joinId: number | null = null,
    createInViews = true
): Promise<lvt.ColumnInfo> {
    const tableColumn = (await core.events.request(
        lvr.addColumnToView(sessionID, tableId, column, joinId)
    )) as lvt.ColumnInfo
    if (createInViews)
        await addColumnToFilterViews(sessionID, tableId, {
            parentColumnId: tableColumn.id,
            attributes: tableColumn.attributes,
        })
    return tableColumn
}

async function addColumnToFilterViews_({
    sessionID,
    tableId,
    column,
}: CoreRequest): Promise<CoreResponse> {
    return addColumnToFilterViews(sessionID, tableId, column)
}
async function addColumnToFilterViews(
    sessionID: string,
    tableId: lvt.ViewDescriptor["id"],
    column: lvt.ColumnSpecifier
): Promise<lvt.ColumnInfo[]> {
    const filterViews = (await core.events.request(
        lvr.listViews(sessionID, selectable.viewId(tableId))
    )) as lvt.ViewDescriptor[]
    return Promise.all(
        filterViews.map(v =>
            core.events.request(lvr.addColumnToView(sessionID, v.id, column))
        )
    )
}

async function removeColumnFromTable_({
    sessionID,
    tableId,
    columnId,
}: CoreRequest): Promise<CoreResponse> {
    return removeColumnFromTable(sessionID, tableId, columnId)
}
async function removeColumnFromTable(
    sessionID: string,
    tableId: lvt.ViewDescriptor["id"],
    columnId: lvt.ColumnInfo["id"]
) {
    let tableInfo = (await core.events.request(
        lvr.getViewInfo(sessionID, tableId)
    )) as lvt.ViewInfo

    if (!selectable.isTable(tableInfo.source))
        return error(
            "removeColumnFromTable",
            `view #${tableId} is a filter view, not a table`
        )

    const column = tableInfo.columns.find(c => c.id === columnId)
    if (!column)
        return error(
            "removeColumnFromTable",
            `view #${tableId} has no column with ID ${columnId}`
        )

    const kind = column.attributes._kind
    switch (kind) {
        case "standard":
            await removeStandardColumn(sessionID, tableId, column)
            break
        case "link":
            await removeLinkColumn(sessionID, tableId, column)
            break
        case "lookup":
            await removeLookupColumn(sessionID, tableId, columnId)
            break
        default:
            return error(
                "removeColumnFromTable",
                `column #${columnId} has unknown kind ${kind}`
            )
    }

    // shift indices on remaining columns
    // in case of links, more columns than the one specified may have
    // disappeared, so we need to refresh.
    tableInfo = (await core.events.request(
        lvr.getViewInfo(sessionID, tableId)
    )) as lvt.ViewInfo
    const indexKey = A.COLUMN_INDEX.key
    const columnUpdates = getColumnIndexUpdates(tableInfo.columns)

    await Promise.all(
        columnUpdates.map(async c =>
            changeTableColumnAttributes(sessionID, tableId, c.id, {
                [indexKey]: c.index,
            })
        )
    )

    return { message: `removed ${kind} column #${columnId}` }
}

async function removeLinkColumn(
    sessionID: string,
    tableId: number,
    column: lvt.ColumnInfo
): Promise<void> {
    const info = (await core.events.request(
        lvr.getViewInfo(sessionID, tableId)
    )) as lvt.ViewInfo
    const join = info.joins.find(j => j.id === column.joinId)

    if (!join)
        return Promise.reject(
            error(
                "removeColumnFromTable",
                `no join with ID ${column.joinId}, in table ${tableId}`
            )
        )
    // remove lookup columns
    const lookupColumns = info.columns.filter(
        c => c.joinId === join.id && c.attributes._kind === "lookup"
    )

    await Promise.all(
        lookupColumns.map(async c =>
            removeColumnFromTable(sessionID, tableId, c.id)
        )
    )
    // remove link column
    await removeColumnFromViews(sessionID, tableId, column.id)
    await core.events.request(lvr.removeColumnFromView(sessionID, column.id))
    // remove join and FK column
    await core.events.request(lvr.removeJoinFromView(sessionID, join.id))
    const fkColumnId = join.on[0]
    await core.events.request(removeColumn(sessionID, fkColumnId))
}

async function removeStandardColumn(
    sessionID: string,
    tableId: number,
    column: lvt.ColumnInfo
): Promise<void> {
    await removeColumnFromViews(sessionID, tableId, column.id)
    await core.events.request(lvr.removeColumnFromView(sessionID, column.id))
    await core.events.request(removeColumn(sessionID, column.parentColumnId))
}

async function removeLookupColumn(
    sessionID: string,
    tableId: number,
    columnId: number
): Promise<void> {
    await removeColumnFromViews(sessionID, tableId, columnId)
    await core.events.request(lvr.removeColumnFromView(sessionID, columnId))
}

async function removeColumnFromViews(
    sessionID: string,
    tableId: number,
    parentColumnId: number
): Promise<void> {
    const views = (await core.events.request(
        lvr.listViews(sessionID, selectable.viewId(tableId))
    )) as lvt.ViewDescriptor[]
    await Promise.all(
        views.map(async v => {
            const info = (await core.events.request(
                lvr.getViewInfo(sessionID, v.id)
            )) as lvt.ViewInfo
            const viewColumn = info.columns.find(
                c => c.parentColumnId === parentColumnId
            )
            if (viewColumn)
                await core.events.request(
                    lvr.removeColumnFromView(sessionID, viewColumn.id)
                )
        })
    )
}

/**
 * Given a list of columns, return a list of columns whose index is wrong
 * and the new index it they should have.
 */
function getColumnIndexUpdates(
    columns: lvt.ColumnInfo[]
): { id: number; index: number }[] {
    const indexKey = A.COLUMN_INDEX.key
    return columns
        .map((c, index) => ({ column: c, index }))
        .filter(pair => pair.column.attributes[indexKey] !== pair.index)
        .map(pair => ({
            id: pair.column.id,
            index: pair.index,
        }))
}

async function changeTableColumnAttributes_({
    sessionID,
    tableId,
    columnId,
    update,
    changeInViews,
}: CoreRequest): Promise<CoreResponse> {
    await changeTableColumnAttributes(
        sessionID,
        tableId,
        columnId,
        update,
        changeInViews
    )
    return { message: `updated column #${columnId}'s attributes` }
}

async function changeTableColumnAttributes(
    sessionID: string,
    tableId: number,
    columnId: number,
    update: Record<string, unknown>,
    changeInViews = true
): Promise<void> {
    const attributes = toSql(update)
    await core.events.request(
        lvr.changeColumnAttributes(sessionID, columnId, attributes)
    )
    if (changeInViews)
        return changeColumnAttributesInViews(
            sessionID,
            tableId,
            columnId,
            attributes
        )
}

async function changeColumnAttributesInViews(
    sessionID: string,
    tableId: number,
    columnId: number,
    update: Record<string, unknown>
): Promise<void> {
    const views = (await core.events.request(
        lvr.listViews(sessionID, selectable.viewId(tableId))
    )) as lvt.ViewDescriptor[]
    const viewColumns: (lvt.ColumnInfo | undefined)[] = await Promise.all(
        views.map(async v => {
            const info = (await core.events.request(
                lvr.getViewInfo(sessionID, v.id)
            )) as lvt.ViewInfo
            const viewColumn = info.columns.find(
                c => c.parentColumnId === columnId
            )
            return viewColumn
        })
    )

    await Promise.all(
        viewColumns.map(async c => {
            if (c === undefined) return
            core.events.request(
                lvr.changeColumnAttributes(sessionID, c.id, update)
            )
        })
    )
}
