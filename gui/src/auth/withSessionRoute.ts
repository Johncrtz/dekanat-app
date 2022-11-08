import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiHandler } from "next"
import { sessionOptions } from "./session"

export const withSessionRoute = (handler: NextApiHandler) =>
    withIronSessionApiRoute(handler, sessionOptions)
