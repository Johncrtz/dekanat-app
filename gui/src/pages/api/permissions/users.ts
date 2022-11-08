import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"
import { User, RoleKind, getUsers } from "@backend/permissions"

/**
 * List all users (only available to admin)
 * @tutorial
 * ```
 * URL: `/api/permissions/users`
 * ```
 */
const GET = withCatchingAPIRoute(async (req, res) => {
    const currentUser = req.session.user!

    if (currentUser.role.roleKind !== RoleKind.Admin)
        throw Error("accessDenied")

    const users = await coreRequest<User[]>(getUsers(), currentUser.authCookie)

    res.status(200).json(users)
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
