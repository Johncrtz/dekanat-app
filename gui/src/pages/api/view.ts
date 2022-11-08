import {
    createView,
    viewId,
    getViewInfo,
    listViews,
    ViewInfo,
    ViewDescriptor,
} from "@intutable/lazy-views"
import { coreRequest } from "api/utils"
import { withSessionRoute } from "auth"
import type { NextApiRequest, NextApiResponse } from "next"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withReadWriteConnection } from "api/utils/databaseConnection"
import { defaultRowOptions } from "@backend/defaults"
import { withUserCheck } from "api/utils/withUserCheck"

/**
 * @tutorial
 * ```
 * - Body: {
 *    tableId: {@type {number}}
 *    name: {@type {string}}
 * }
 * ```
 */
const POST = withCatchingAPIRoute(
    async (req: NextApiRequest, res: NextApiResponse) => {
        const { tableId, name } = req.body as {
            tableId: ViewDescriptor["id"]
            name: string
        }
        const user = req.session.user!

        const filterView = await withReadWriteConnection(
            user,
            async sessionID => {
                // avoid duplicates
                const existingViews = await coreRequest<ViewDescriptor[]>(
                    listViews(sessionID, viewId(tableId)),
                    user.authCookie
                )
                if (existingViews.some(v => v.name === name))
                    throw Error("alreadyTaken")

                // create new filter view
                const tableColumns = await coreRequest<ViewInfo>(
                    getViewInfo(sessionID, tableId),
                    user.authCookie
                ).then(i => i.columns)
                return coreRequest<ViewDescriptor>(
                    createView(
                        sessionID,
                        viewId(tableId),
                        name,
                        { columns: [], joins: [] },
                        defaultRowOptions(tableColumns),
                        user.id
                    ),
                    user.authCookie
                )
            }
        )

        res.status(200).json(filterView)
    }
)

export default withSessionRoute(
    withUserCheck(async (req: NextApiRequest, res: NextApiResponse) => {
        switch (req.method) {
            case "POST":
                await POST(req, res)
                break
            default:
                res.setHeader("Allow", ["POST"])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    })
)
