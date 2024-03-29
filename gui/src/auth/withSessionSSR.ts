import { withIronSessionSsr } from "iron-session/next"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { sessionOptions } from "./session"

// Theses types are compatible with InferGetStaticPropsType
export const withSessionSsr = <
    P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
    handler: (
        context: GetServerSidePropsContext
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => withIronSessionSsr(handler, sessionOptions)
