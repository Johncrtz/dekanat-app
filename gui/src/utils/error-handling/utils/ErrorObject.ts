import Obj from "types/Obj"

/**
 * Structure used when an error needs to be transported through the network.
 *
 * The Backend will send an object like `{error: "this is a error message"}`
 *
 * Generic `<T>` is usally the message of the error @type {Error["message"]}
 */
export type ErrorObject<T = unknown> = {
    error: T
}

/**
 * Type Guard for @type {ErrorObject}.
 * @param value
 * @returns
 */
export const isErrorObject = (value: unknown): value is ErrorObject => {
    // reject everything that is not a plain object
    if (
        typeof value !== "object" ||
        value == null ||
        typeof value === "function" ||
        Array.isArray(value)
    )
        return false

    const obj = value as Obj

    if (Object.prototype.hasOwnProperty.call(obj, "error")) return true

    return false
}
