import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"
import { RoleKind, deleteUser, changeRole } from "@backend/permissions"

/**
 * Delete a user.
 * @tutorial
 * ```
 * URL: `/api/permissions/user/[userId]`
 * ```
 */
const DELETE = withCatchingAPIRoute(async (req, res, userId: number) => {
    const currentUser = req.session.user!

    if (currentUser.role.roleKind !== RoleKind.Admin)
        throw Error("accessDenied")

    const response = await coreRequest<{ message: string }>(
        deleteUser(userId),
        currentUser.authCookie
    )

    res.status(200).json(response)
})

/**
 * Change a user's role.
 * @tutorial
 * ```
 * URL: `/api/permissions/user/[userId]`
 * Body: { roleId: number }
 * ```
 */
const PATCH = withCatchingAPIRoute(async (req, res, userId: number) => {
    const { roleId } = req.body as {
        roleId: number
    }
    const currentUser = req.session.user!

    if (currentUser.role.roleKind !== RoleKind.Admin)
        throw Error("accessDenied")

    const response = await coreRequest<{ message: string }>(
        changeRole(userId, roleId),
        currentUser.authCookie
    )

    res.status(200).json(response)
})

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        const { query, method } = req
        const userId = parseInt(query.userId as string)

        switch (method) {
            case "DELETE":
                await DELETE(req, res, userId)
                break
            case "PATCH":
                await PATCH(req, res, userId)
                break
            default:
                res.setHeader("Allow", ["DELETE", "PATCH"])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    })
)
