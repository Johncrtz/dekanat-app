import {
    asView,
    ColumnInfo,
    getViewInfo,
    ViewDescriptor,
    ViewInfo,
} from "@intutable/lazy-views"
import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withReadWriteConnection } from "api/utils/databaseConnection"
import { withSessionRoute } from "auth"
import { lookupColumnAttributes } from "@backend/defaults"
import { addColumnToTable } from "@backend/requests"

/**
 * Add a lookup field from a linked table, i.e. another column whose data
 * are not entered directly, but copied from the joined table.
 * @tutorial
 * ```
 * - Body: {
 *     tableId: {@type {number}}
 *     joinId: {@type {number}}
 * }
 * ```
 */
const POST = withCatchingAPIRoute(
    async (req, res, parentColumnId: ColumnInfo["id"]) => {
        const { tableId, joinId } = req.body as {
            tableId: ViewDescriptor["id"]
            joinId: Exclude<ColumnInfo["joinId"], null>
        }
        const user = req.session.user!

        const column = await withReadWriteConnection(user, async sessionID => {
            const tableInfo = await coreRequest<ViewInfo>(
                getViewInfo(sessionID, tableId),
                user.authCookie
            )

            // find the column
            const join = tableInfo.joins.find(j => j.id === joinId)!
            const foreignTableInfo = await coreRequest<ViewInfo>(
                getViewInfo(sessionID, asView(join.foreignSource).id),
                user.authCookie
            )
            const foreignColumn = foreignTableInfo.columns.find(
                c => c.id === parentColumnId
            )!

            // determine column meta attributes
            const displayName =
                foreignColumn.attributes.displayName || foreignColumn.name
            const contentType =
                foreignColumn.attributes._cellContentType || "string"
            const columnIndex = tableInfo.columns.length
            const attributes = lookupColumnAttributes(
                displayName,
                contentType,
                columnIndex
            )

            // add to table and views
            const newColumn = await coreRequest<ColumnInfo>(
                addColumnToTable(
                    sessionID,
                    tableId,
                    { parentColumnId: parentColumnId, attributes },
                    joinId
                ),
                user.authCookie
            )
            return newColumn
        })

        res.status(200).json(column)
    }
)

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        const { query } = req
        const parentColumnId = parseInt(query.parentColumnId as string)

        switch (req.method) {
            case "POST":
                await POST(req, res, parentColumnId)
                break
            default:
                res.setHeader("Allow", ["POST"])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    })
)
