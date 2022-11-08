import {
    asTable,
    deleteView,
    getViewData,
    getViewOptions,
    listViews,
    renameView,
    TableDescriptor,
    tableId as makeTableId,
    viewId,
    ViewData,
    ViewDescriptor,
    ViewOptions,
} from "@intutable/lazy-views"
import {
    getTablesFromProject,
    removeTable,
} from "@intutable/project-management/dist/requests"
import { ProjectDescriptor } from "@intutable/project-management/dist/types"
import { coreRequest } from "api/utils"
import { Table } from "api/utils/parse"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import {
    withReadWriteConnection,
    withReadOnlyConnection,
} from "api/utils/databaseConnection"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"

/**
 * GET a single table view's data {@type {TableData.Serialized}}.
 *
 * @tutorial
 * ```
 * - URL: `/api/table/[id]` e.g. `/api/table/1`
 * - Body: {}
 * ```
 */
const GET = withCatchingAPIRoute(
    async (req, res, tableId: ViewDescriptor["id"]) => {
        const user = req.session.user!
        const parsedTableData = await withReadOnlyConnection(
            user,
            async sessionID =>
                coreRequest<ViewData>(
                    getViewData(sessionID, tableId),
                    user.authCookie
                ).then(Table.parse)
        )

        res.status(200).json(parsedTableData)
    }
)

/**
 * PATCH/update the name of a single table.
 * Returns the updated table view {@type {ViewDescriptor}}.
 * 
 * // TODO: In a future version this api route will be able to adjust more than the name.

 * @tutorial
 * ```
 * - URL: `/api/project/[id]` e.g. `/api/project/1`
 * - Body: {
 *     newName: {@type {string}}
 *   }
 * ```
 */
const PATCH = withCatchingAPIRoute(
    async (req, res, tableId: ViewDescriptor["id"]) => {
        const { newName, project } = req.body as {
            newName: ViewDescriptor["name"]
            project: ProjectDescriptor
        }
        const user = req.session.user!

        const updatedTable = await withReadWriteConnection(
            user,
            async sessionID => {
                // check if name is taken
                const baseTables = await coreRequest<TableDescriptor[]>(
                    getTablesFromProject(sessionID, project.id),
                    user.authCookie
                )
                const tables = await Promise.all(
                    baseTables.map(tbl =>
                        coreRequest<ViewDescriptor[]>(
                            listViews(sessionID, makeTableId(tbl.id)),
                            user.authCookie
                        )
                    )
                ).then(tableLists => tableLists.flat())

                const isTaken = tables
                    .map(tbl => tbl.name.toLowerCase())
                    .includes(newName.toLowerCase())
                if (isTaken) throw new Error("alreadyTaken")

                // rename only view, underlying table's name does not matter.
                // TODO: uh, does it? oh man...
                const updatedTable = await coreRequest<ViewDescriptor>(
                    renameView(sessionID, tableId, newName),
                    user.authCookie
                )
                return updatedTable
            }
        )

        res.status(200).json(updatedTable)
    }
)

/**
 * DELETE a table. Returns an empty object.
 *
 * @tutorial
 * ```
 * - URL: `/api/table/[id]` e.g. `/api/table/1`
 * - Body: {}
 * ```
 */
const DELETE = withCatchingAPIRoute(
    async (req, res, tableId: ViewDescriptor["id"]) => {
        const user = req.session.user!

        await withReadWriteConnection(user, async sessionID => {
            // delete filter views
            const filterViews = await coreRequest<ViewDescriptor[]>(
                listViews(sessionID, viewId(tableId)),
                user.authCookie
            )

            Promise.all(
                filterViews.map(v =>
                    coreRequest(deleteView(sessionID, v.id), user.authCookie)
                )
            )

            const options = await coreRequest<ViewOptions>(
                getViewOptions(sessionID, tableId),
                user.authCookie
            )

            // delete table view
            await coreRequest(deleteView(sessionID, tableId), user.authCookie)

            // delete table in project-management
            await coreRequest(
                removeTable(sessionID, asTable(options.source).id),
                user.authCookie
            )
        })
        res.status(200).json({})
    }
)

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        const { query, method } = req
        const tableId = parseInt(query.tableId as string)

        switch (method) {
            case "GET":
                await GET(req, res, tableId)
                break
            case "PATCH":
                await PATCH(req, res, tableId)
                break
            case "DELETE":
                await DELETE(req, res, tableId)
                break
            default:
                res.setHeader("Allow", ["GET", "PATCH", "DELETE"])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
    })
)
