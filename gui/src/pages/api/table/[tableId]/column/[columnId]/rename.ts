import {
    ColumnInfo,
    getViewInfo,
    ViewDescriptor,
    ViewInfo,
} from "@intutable/lazy-views"
import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withReadWriteConnection } from "api/utils/databaseConnection"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"

import { changeTableColumnAttributes } from "@backend/requests"

/**
 * Rename a column.
 * @tutorial
 * ```
 * URL : `/api/table/[tableId]/column/[columnId]/rename`, e.g.
 * `/api/table/5/column/32/rename`
 * - Body: { newName: string }
 * ```
 */
const PATCH = withCatchingAPIRoute(
    async (
        req,
        res,
        tableId: ViewDescriptor["id"],
        columnId: ColumnInfo["id"]
    ) => {
        const { newName } = req.body as { newName: string }
        const user = req.session.user!

        await withReadWriteConnection(user, async sessionID => {
            const tableInfo = await coreRequest<ViewInfo>(
                getViewInfo(sessionID, tableId),
                user.authCookie
            )

            // check if the name is already taken
            if (
                tableInfo.columns.some(
                    c => c.attributes.displayName === newName
                )
            )
                throw Error("alreadyTaken")
            else
                await coreRequest<void>(
                    changeTableColumnAttributes(sessionID, tableId, columnId, {
                        displayName: newName,
                    }),
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
        const columnId = parseInt(query.columnId as string)

        switch (method) {
            case "PATCH":
                await PATCH(req, res, tableId, columnId)
                break
            default:
                res.setHeader("Allow", ["PATCH", "DELETE"])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
    })
)
