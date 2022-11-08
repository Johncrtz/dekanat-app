import { ViewDescriptor } from "@intutable/lazy-views"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"
import { ExportRequest } from "utils/Export/ExportRequest"
import { ExportUtil } from "utils/Export/ExportUtil"

/**
 * Generate a Mail-List
 * @tutorial
 * ```
 * URL: `/util/generate/mail-list`
 * ```
 */
const POST = withCatchingAPIRoute(
    async (req, res, viewId: ViewDescriptor["id"]) => {
        const user = req.session.user!
        const { exportRequest } = JSON.parse(req.body) as {
            exportRequest: ExportRequest
        }

        const util = new ExportUtil(
            exportRequest,
            { response: res, viewId },
            user
        )

        await util.export()
        await util.send()
    }
)

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        const { query, method } = req
        const viewId = parseInt(query.viewId as string)

        switch (method) {
            case "POST":
                await POST(req, res, viewId)
                break
            default:
                res.setHeader("Allow", ["POST"])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
    })
)
