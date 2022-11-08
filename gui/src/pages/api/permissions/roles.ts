import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"
import { Role, getRoles } from "@backend/permissions"

/**
 * List all roles (only available to admin)
 * @tutorial
 * ```
 * URL: `/api/permissions/users`
 * ```
 */
const GET = withCatchingAPIRoute(async (req, res) => {
    const currentUser = req.session.user!
    const roles = await coreRequest<Role[]>(getRoles(), currentUser.authCookie)

    res.status(200).json(roles)
})

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        switch (req.method) {
            case "GET":
                await GET(req, res)
                break
            default:
                res.setHeader("Allow", ["GET"])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    })
)
