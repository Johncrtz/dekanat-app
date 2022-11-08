import {
    changeColumnAttributes,
    ColumnInfo,
    getViewInfo,
    removeColumnFromView,
    ViewDescriptor,
    ViewInfo,
} from "@intutable/lazy-views"

import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withSessionRoute } from "auth"
import { withReadWriteConnection } from "api/utils/databaseConnection"
import { withUserCheck } from "api/utils/withUserCheck"
import { toSql } from "@shared/attributes"

/**
 * Update the metadata of a column. Only its `attributes` can be changed, all
 * other properties are directly necessary to functionality and must not be
 * messed with.
 * @tutorial
 * ```
 * URL : `/api/column/[id]`, e.g. `/api/column/32`
 * - Body: {
 *    user: {@type {User}}
 *    projectId: {@type {number}}
 *    name: {@type {string}}
 * }
 * ```
 */
const PATCH = withCatchingAPIRoute(
    async (
        req,
        res,
        viewId: ViewDescriptor["id"],
        columnId: ColumnInfo["id"]
    ) => {
        const { update } = req.body as {
            update: Record<string, unknown>
        }
        const user = req.session.user!

        const updatedColumn = await withReadWriteConnection(
            user,
            async sessionID => {
                const filterView = await coreRequest<ViewInfo>(
                    getViewInfo(sessionID, viewId),
                    user.authCookie
                )
                const column = filterView.columns.find(c => c.id === columnId)

                if (!column) throw Error("columnNotFound")

                // change property in view column, underlying table column
                // is never used anyway.
                return coreRequest<ColumnInfo>(
                    changeColumnAttributes(sessionID, columnId, toSql(update)),
                    user.authCookie
                )
            }
        )

        res.status(200).json(updatedColumn)
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
        viewId: ViewDescriptor["id"],
        columnId: ColumnInfo["id"]
    ) => {
        const user = req.session.user!

        await withReadWriteConnection(user, async sessionID => {
            const filterView = await coreRequest<ViewInfo>(
                getViewInfo(sessionID, viewId),
                user.authCookie
            )
            const column = filterView.columns.find(c => c.id === columnId)

            if (!column) throw Error("columnNotFound")

            // delete column in table view:
            await coreRequest(
                removeColumnFromView(sessionID, columnId),
                user.authCookie
            )
        })
        res.status(200).json({})
    }
)

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        const { query, method } = req
        const viewId = parseInt(query.viewId as string)
        const columnId = parseInt(query.columnId as string)

        switch (method) {
            case "PATCH":
                await PATCH(req, res, viewId, columnId)
                break
            case "DELETE":
                await DELETE(req, res, viewId, columnId)
                break
            default:
                res.setHeader("Allow", ["PATCH", "DELETE"])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
    })
)
