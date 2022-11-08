import { NextApiRequest } from "next"
import Obj from "types/Obj"
import { ErrorLike } from "utils/error-handling/ErrorLike"
const CORE_ENDPOINT = process.env.NEXT_PUBLIC_CORE_ENDPOINT_URL!
const AUTH_COOKIE_KEY = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!

export class CoreRequestError extends Error {
    public readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = this.constructor.name
        // this.stack = new Error().stack
        this.status = status
    }
}

/**
 * Makes a request to Core and returns the response parsed from JSON as an
 * object. Built up on `fetch`.
 * @async
 * @param {object} request - A standard core request with channel, method,
 * and whatever arguments that method takes. Use `<plugin>/dist/requests` to
 * build these.
 * @param {string} authCookie - The auth cookie to send with the request. Optional.
 * @returns {Promise<object>} - The response parsed from JSON as an object.
 * @throws {CoreRequestError}
 */
export const coreRequest = async <T = unknown>(
    request: Obj,
    authCookie?: NextApiRequest | string
): Promise<T> => {
    const { channel, method, ...req } = request

    if (authCookie == null) throw new RangeError("AuthCookie is not defined!")

    const cookie =
        typeof authCookie === "string"
            ? authCookie
            : authCookie.cookies[AUTH_COOKIE_KEY]

    return fetch(CORE_ENDPOINT + "/request/" + channel + "/" + method, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(cookie && {
                Cookie: AUTH_COOKIE_KEY + "=" + cookie,
            }),
        },
        credentials: "include",
        redirect: "manual",
        body: JSON.stringify(req),
    })
        .then(passedLogin)
        .then(checkError)
        .then(res => res.json())
}

// TODO: once serialization for errors is implemented, replace those functions

// Set of error checking functions that are intended to operate by
// fall-through principle
export const passedLogin = async (res: Response): Promise<Response> => {
    if (res.type === "opaqueredirect" || [301, 302].includes(res.status))
        throw {
            name: "AuthenticationError",
            stack: "Next API Handler",
            message: "core call blocked by authentication middleware",
            status: 302,
        } as ErrorLike

    return res
}

export const checkError = async (res: Response): Promise<Response> => {
    if (res.ok) return res
    throw new CoreRequestError(await res.text(), res.status)
}
