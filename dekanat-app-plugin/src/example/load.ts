import { PluginLoader } from "@intutable/core"
import { insert } from "@intutable/database/dist/requests"
import {
    ProjectDescriptor,
    TableDescriptor,
    TableInfo,
    ColumnDescriptor,
} from "@intutable/project-management/dist/types"
import {
    createProject,
    createTableInProject,
    getTableInfo,
    createColumnInTable,
} from "@intutable/project-management/dist/requests"
import { requests as v_req } from "@intutable/lazy-views/"
import { types as v_types } from "@intutable/lazy-views"
import { tableId, viewId } from "@intutable/lazy-views"

import { emptyRowOptions, defaultRowOptions } from "../defaults"

import {
    TableSpec,
    JoinSpec,
    Table,
    PERSONEN,
    PERSONEN_DATA,
    ORGANE,
    ORGANE_DATA,
    ROLLEN,
    ROLLEN_DATA,
} from "./schema"

let personen: Table
let organe: Table
let simpleTables: Table[]
let rollen: Table

export async function createExampleSchema(
    core: PluginLoader,
    sessionID: string,
    adminId: number
): Promise<void> {
    const project: ProjectDescriptor = (await core.events.request(
        createProject(sessionID, adminId, "Fakultät MathInf")
    )) as ProjectDescriptor
    personen = await createTable(core, sessionID, adminId, project.id, PERSONEN)
    organe = await createTable(core, sessionID, adminId, project.id, ORGANE)
    simpleTables = [personen, organe]
    rollen = await createTable(core, sessionID, adminId, project.id, ROLLEN)
}
async function createTable(
    core: PluginLoader,
    sessionID: string,
    userId: number,
    projectId: number,
    table: TableSpec
): Promise<Table> {
    const baseTable: TableDescriptor = (await core.events.request(
        createTableInProject(
            sessionID,
            userId,
            projectId,
            table.name,
            table.columns.map(c => c.baseColumn)
        )
    )) as TableDescriptor
    const tableInfo = (await core.events.request(
        getTableInfo(sessionID, baseTable.id)
    )) as TableInfo
    const viewColumns: v_types.ColumnSpecifier[] = table.columns.map(c => {
        const baseColumn = tableInfo.columns.find(
            parent => parent.name === c.baseColumn.name
        )!
        return {
            parentColumnId: baseColumn.id,
            attributes: c.attributes,
        }
    })
    const tableView = (await core.events.request(
        v_req.createView(
            sessionID,
            tableId(baseTable.id),
            table.name,
            { columns: viewColumns, joins: [] },
            emptyRowOptions(),
            userId
        )
    )) as v_types.ViewDescriptor
    // add joins
    await Promise.all(
        table.joins.map(j => addJoin(core, sessionID, baseTable, tableView, j))
    )

    const tableViewInfo = (await core.events.request(
        v_req.getViewInfo(sessionID, tableView.id)
    )) as v_types.ViewInfo
    const filterView = await core.events.request(
        v_req.createView(
            sessionID,
            viewId(tableView.id),
            "Standard",
            { columns: [], joins: [] },
            defaultRowOptions(tableViewInfo.columns),
            userId
        )
    )
    const tableDescriptors = { baseTable, tableView, filterView }
    return tableDescriptors
}

async function addJoin(
    core: PluginLoader,
    sessionID: string,
    baseTable: TableDescriptor,
    tableView: v_types.ViewDescriptor,
    join: JoinSpec
): Promise<void> {
    const fk = (await core.events.request(
        createColumnInTable(
            sessionID,
            baseTable.id,
            join.fkColumn.name,
            join.fkColumn.type
        )
    )) as ColumnDescriptor
    const foreignTable = simpleTables.find(
        t => t.tableView.name === join.table
    )!
    const info = (await core.events.request(
        v_req.getViewInfo(sessionID, foreignTable.tableView.id)
    )) as TableInfo
    const pk = info.columns.find(c => c.name === join.pkColumn)!
    const foreignColumns = join.linkColumns.map(l => {
        const parentColumn = info.columns.find(c => c.name === l.name)!
        return {
            parentColumnId: parentColumn.id,
            attributes: l.attributes,
        }
    })
    await core.events.request(
        v_req.addJoinToView(sessionID, tableView.id, {
            foreignSource: viewId(foreignTable.tableView.id),
            on: [fk.id, "=", pk.id],
            columns: foreignColumns,
        })
    )
}

export async function insertExampleData(
    core: PluginLoader,
    sessionID: string
): Promise<void> {
    await Promise.all(
        PERSONEN_DATA.map(r =>
            core.events.request(insert(sessionID, personen.baseTable.key, r))
        )
    )
    await Promise.all(
        ORGANE_DATA.map(r =>
            core.events.request(insert(sessionID, organe.baseTable.key, r))
        )
    )
    await Promise.all(
        ROLLEN_DATA.map(r =>
            core.events.request(insert(sessionID, rollen.baseTable.key, r))
        )
    )
}
