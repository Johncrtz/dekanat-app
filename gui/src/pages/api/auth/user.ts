import { getCurrentUser } from "auth"
import { withSessionRoute } from "auth/withSessionRoute"
import { NextApiRequest, NextApiResponse } from "next"
import { User } from "types/User"
import { GUEST_ROLE } from "@backend/permissions"

const userRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.session == null || req.session.user == null)
            throw new Error("No session")

        const user = await getCurrentUser(req.session.user.authCookie)
        if (user == null)
            return res.json({
                isLoggedIn: false,
                username: "",
                authCookie: "",
                id: -1,
                role: GUEST_ROLE,
            } as User)

        res.json({
            ...req.session.user,
            isLoggedIn: true,
        } as User)
    } catch (error) {
        res.status(500).send("Could not get the user")
    }
}

export default withSessionRoute(userRoute)
