import { randomBytes } from "crypto"
import { User } from "types/User"
import {
    openConnection,
    closeConnection,
} from "@intutable/database/dist/requests"
import { coreRequest } from "./coreRequest"

let nextSessionID = 0
const getNextSessionID = () => {
    const id = "dekanat-app_" + nextSessionID + randomBytes(20).toString("hex")
    nextSessionID++
    return id
}

/**
 * Acquire a connection with read/write privileges to the database, run
 * a callback with it, and return its result.
 * Reject with an { error: message } if the credentials are not found or
 * if the login fails.
 */
export const withReadWriteConnection = async <T>(
    user: User,
    callback: (sessionID: string) => Promise<T>
): Promise<T> => {
    const username = process.env.DB_RW_USERNAME
    const password = process.env.DB_RW_PASSWORD
    if (!username || !password)
        return Promise.reject({
            error: "username or password not found in env",
        })

    const sessionID = getNextSessionID()

    await coreRequest<void>(
        openConnection(sessionID, username, password),
        user.authCookie
    )
    let result: T
    try {
        result = await callback(sessionID)
    } finally {
        await coreRequest<void>(closeConnection(sessionID), user.authCookie)
    }
    return result
}

/**
 * Acquire a connection with read-only privileges to the database, run
 * a callback with it, and return its result.
 * Reject with an { error: message } if the credentials are not found or
 * if the login fails.
 */
export const withReadOnlyConnection = async <T>(
    user: User,
    callback: (sessionID: string) => Promise<T>
): Promise<T> => {
    const username = process.env.DB_RDONLY_USERNAME
    const password = process.env.DB_RDONLY_PASSWORD
    if (!username || !password)
        throw Error("username or password not found in env")

    const sessionID = getNextSessionID()

    await coreRequest<void>(
        openConnection(sessionID, username, password),
        user.authCookie
    )
    let result: T
    try {
        result = await callback(sessionID)
    } finally {
        await coreRequest<void>(closeConnection(sessionID), user.authCookie)
    }
    return result
}
