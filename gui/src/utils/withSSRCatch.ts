import { withIronSessionSsr } from "iron-session/next"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ErrorLike, isErrorLike } from "./error-handling/ErrorLike"
/**
 * {@link fetcher} is mostly used client-side. Errors get catches by swr automatically.
 * But in case of a server-side error, the error is thrown and crashes the app
 * (in dev mode, in production it will redirect to an error page).
 *
 * Because the error is thrown, the error is not caught by swr,
 * and this needs to wrap the getServerSideProps function.
 */
export const withSSRCatch =
    <P extends { [key: string]: unknown } = { [key: string]: unknown }>(
        handler: (
            context: GetServerSidePropsContext
        ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
    ) =>
    async (context: GetServerSidePropsContext) => {
        try {
            return await handler(context)
        } catch (error) {
            console.log("withSSRCatch error:", error)
            // atm only auth errors will differ from the default behaviour (overlay in dev mode, error page in prod).
            // but other errors could be handled differently here, if needed.
            if (isErrorLike(error) && error.name === "AuthenticationError")
                return { notFound: true }

            throw error
        }
    }
