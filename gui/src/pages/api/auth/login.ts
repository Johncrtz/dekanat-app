import { getCurrentUser } from "auth"
import { withSessionRoute } from "auth/withSessionRoute"
import { NextApiRequest, NextApiResponse } from "next"
import type { User } from "types/User"

const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.body

    try {
        const loginRequest = await fetch(
            process.env.NEXT_PUBLIC_CORE_ENDPOINT_URL! + "/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    // "Content-Type": "application/json",
                },
                redirect: "manual",
                credentials: "include",
                body: `username=${username}&password=${password}`,
            }
        )

        // TODO: make proper checker function
        if (loginRequest.status !== 302)
            throw new Error(`Netzwerkfehler, Status = ${loginRequest.status}`)

        const text = await loginRequest.text()

        if (text.includes("secret") === false)
            throw new Error(
                "Kombination aus Nutzername und Passwort nicht gefunden!"
            )

        const authCookie = loginRequest.headers
            .get("set-cookie")!
            .split(";")
            .map(c => c.split("="))
            .find(c => c[0] === "connect.sid")![1]

        const user = await getCurrentUser(authCookie)
        if (user == null)
            throw new Error(
                "Could not get the current user from user-authentication!"
            )

        req.session.user = { isLoggedIn: true, ...user } as User

        await req.session.save()

        res.json(user)
    } catch (error) {
        res.status(401).json({ error: (error as Error).message })
    }
}

export default withSessionRoute(loginRoute)
