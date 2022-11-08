import { NextApiRequest, NextApiResponse } from "next"
import { ErrorLike, isErrorLike } from "utils/error-handling/ErrorLike"
import { makeError } from "utils/error-handling/utils/makeError"

export type CustomNextApiHandler<T extends unknown[]> = (
    req: NextApiRequest,
    res: NextApiResponse,
    ...args: T
) => Promise<void>

/**
 * A custom Next.js API handler that catches errors and sends them to the client.
 * @param handler
 */
export const withCatchingAPIRoute =
    <T extends unknown[]>(handler: CustomNextApiHandler<T>) =>
    async (req: NextApiRequest, res: NextApiResponse, ...args: T) => {
        try {
            await handler(req, res, ...args)
        } catch (error) {
            if (isErrorLike(error)) {
                const err = error as ErrorLike
                console.log(err.toString())
                const status = Object.prototype.hasOwnProperty.call(
                    err,
                    "status"
                )
                    ? (err as unknown as { status: number }).status
                    : 500
                return res.status(status).json({ error: err.toString() })
            }

            const err = makeError(error)
            res.status(500).json({ error: err.message })
        }
    }
