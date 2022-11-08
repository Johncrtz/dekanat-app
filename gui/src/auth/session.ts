// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions

import type { IronSessionOptions } from "iron-session"
import type { User } from "types/User"
import getConfig from "next/config"
const { serverRuntimeConfig } = getConfig()

export const sessionOptions: IronSessionOptions = {
    password: serverRuntimeConfig.ironAuthSecret,
    cookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME as string,
    // ttl: 3600,
    cookieOptions: {
        // httpOnly: false,
        // sameSite: "lax",
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        // secure: process.env.NODE_ENV === "production",
        secure: false,
    },
}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
    interface IronSessionData {
        user?: User
    }
}
