import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"
import { User, RoleKind, createUser } from "@backend/permissions"

/**
 * Create a new user.
 * @tutorial
 * ```
 * URL: `/api/permissions/user`
 * Body: {
 *    user: Omit<User, "id">
 *    password: string
 * }
 * ```
 */
const POST = withCatchingAPIRoute(async (req, res) => {
    const { user, password } = req.body as {
        user: Omit<User, "id">
        password: string
    }
    const currentUser = req.session.user!

    if (currentUser.role.roleKind !== RoleKind.Admin)
        throw Error("accessDenied")

    const response = await coreRequest<{ message: string }>(
        createUser(user, password),
        currentUser.authCookie
    )

    res.status(200).json(response)
})

export default withSessionRoute(
    withUserCheck(async (req, res) => {
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
