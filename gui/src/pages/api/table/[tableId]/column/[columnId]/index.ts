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

import {
    removeColumnFromTable,
    changeTableColumnAttributes,
} from "@backend/requests"

/**
 * Update the metadata of a column. Only its `attributes` can be changed, all
 * other properties are directly necessary to functionality and must not be
 * messed with.
 * Do not use this to rename columns; there is an extra endpoint for that.
 * This one will error if your update contains `displayName`
 * @tutorial
 * ```
 * URL : `/api/table/[tableId]/column/[columnId]`, e.g.
 * `/api/table/5/column/32`
 * - Body: {
 *     update: Record<string, unknown>
 * }
 * ```
 */
const PATCH = withCatchingAPIRoute(
    async (
        req,
        res,
        tableId: ViewDescriptor["id"],
        columnId: ColumnInfo["id"]
    ) => {
        const { update, changeInViews } = req.body as {
            update: Record<string, unknown>
            changeInViews?: boolean
        }
        const changeInViews_ =
            typeof changeInViews === "boolean" ? changeInViews : true

        const user = req.session.user!
        // only use the dedicated rename endpoint for changing the name
        if (update["displayName"] !== undefined)
            throw Error("useRenameEndpoint")

        await withReadWriteConnection(user, async sessionID => {
            await coreRequest<void>(
                changeTableColumnAttributes(
                    sessionID,
                    tableId,
                    columnId,
                    update,
                    changeInViews_
                ),
                user.authCookie
            )
        })

        res.status(200).json({})
    }
)

/**
 * Delete a column.
 * @tutorial
 * ```
 * URL : `/api/column/[id]`, e.g. `/api/column/32`
 * - Body: {
 *    viewId: {@type {number}}
 * }
 * ```
 */
const DELETE = withCatchingAPIRoute(
    async (
        req,
        res,
        tableId: ViewDescriptor["id"],
        columnId: ColumnInfo["id"]
    ) => {
        const user = req.session.user!

        await withReadWriteConnection(user, async sessionID => {
            const tableInfo = await coreRequest<ViewInfo>(
                getViewInfo(sessionID, tableId),
                user.authCookie
            )
            const column = tableInfo.columns.find(c => c.id === columnId)

            if (!column) throw Error("columnNotFound")
            if (column.attributes.userPrimary)
                // cannot delete the primary column
                throw Error("deleteUserPrimary")

            await coreRequest(
                removeColumnFromTable(sessionID, tableId, columnId),
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
            case "DELETE":
                await DELETE(req, res, tableId, columnId)
                break
            default:
                res.setHeader("Allow", ["PATCH", "DELETE"])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
    })
)
