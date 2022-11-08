import { update } from "@intutable/database/dist/requests"
import {
    asTable,
    getViewInfo,
    JoinDescriptor,
    ViewDescriptor,
    ViewInfo,
} from "@intutable/lazy-views"
import { getTableInfo } from "@intutable/project-management/dist/requests"
import { TableInfo } from "@intutable/project-management/dist/types"
import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"
import { withReadWriteConnection } from "api/utils/databaseConnection"

/**
 * Link rows in linked tables, by setting the value in the linking table's
 * foreign key column.
 * @tutorial
 * ```
 * - URL: `/api/join/[id]`, e.g. `/api/join/3`
 * - Body: {
 *    tableId: {@type {number} The ID of the view in which to create the link.
 *    rowId: {@type {number}} Row of the linking table.
 *    value: {@type {number}} The ID of the row in the linked table.
 * }
 * ```
 */
const POST = withCatchingAPIRoute(
    async (req, res, joinId: JoinDescriptor["id"]) => {
        const { tableId, rowId, value } = req.body as {
            tableId: ViewDescriptor["id"]
            rowId: number
            value: number | null
        }
        const user = req.session.user!

        await withReadWriteConnection(user, async sessionID => {
            const tableInfo = await coreRequest<ViewInfo>(
                getViewInfo(sessionID, tableId),
                user.authCookie
            )

            const baseTableInfo = await coreRequest<TableInfo>(
                getTableInfo(sessionID, asTable(tableInfo.source).table.id),
                user.authCookie
            )

            const join = tableInfo.joins.find(j => j.id === joinId)!
            const fkColumn = baseTableInfo.columns.find(
                c => c.id === join.on[0]
            )!

            await coreRequest(
                update(sessionID, asTable(tableInfo.source).table.key, {
                    condition: ["_id", rowId],
                    update: { [fkColumn.name]: value },
                }),
                user.authCookie
            )
        })

        res.status(200).json({})
    }
)

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        const { query } = req
        const joinId = parseInt(query.joinId as string)

        switch (req.method) {
            case "POST":
                await POST(req, res, joinId)
                break
            default:
                res.setHeader("Allow", ["POST"])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    })
)
