import { ViewDescriptor, listViews, viewId } from "@intutable/lazy-views"
import { coreRequest } from "api/utils"
import { withSessionRoute } from "auth"
import type { NextApiRequest, NextApiResponse } from "next"
import { makeError } from "utils/error-handling/utils/makeError"
import { withUserCheck } from "api/utils/withUserCheck"
import { withReadOnlyConnection } from "api/utils/databaseConnection"

/**
 * List views on a given table.
 * @tutorial
 * ```
 * URL: `/api/views/[tableId]`
 * ```
 */
const GET = async (
    req: NextApiRequest,
    res: NextApiResponse,
    tableId: ViewDescriptor["id"]
) => {
    try {
        const user = req.session.user!
        const views = await withReadOnlyConnection(user, async sessionID =>
            coreRequest<ViewDescriptor[]>(
                // remember, the table is itself a view
                listViews(sessionID, viewId(tableId)),
                user.authCookie
            )
        )

        res.status(200).json(views)
    } catch (err) {
        const error = makeError(err)
        res.status(500).json({ error: error.message })
    }
}

export default withSessionRoute(
    withUserCheck(async (req: NextApiRequest, res: NextApiResponse) => {
        const { query, method } = req
        const tableId = parseInt(query.tableId as string)

        switch (method) {
            case "GET":
                await GET(req, res, tableId)
                break
            default:
                res.setHeader("Allow", ["GET"])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
    })
)
