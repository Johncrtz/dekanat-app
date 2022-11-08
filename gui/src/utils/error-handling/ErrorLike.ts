import Obj from "types/Obj"

/**
 * Error like object
 */
export type ErrorLike = {
    name: string
    stack: string
    message: string
    [key: string]: unknown
}

/**
 * Type Guard for @type {ErrorLike}
 */
export const isErrorLike = (value: unknown): value is ErrorLike => {
    const isObject =
        value != null &&
        typeof value === "object" &&
        Array.isArray(value) === false &&
        typeof "value" !== "function"

    if (isObject === false) return false

    const obj = value as Obj

    const hasNameProp = "name" in obj && typeof obj.name === "string"
    const hasStackProp = "stack" in obj && typeof obj.stack === "string"
    const hasMessageProp = "message" in obj && typeof obj.message === "string"

    return hasNameProp && hasStackProp && hasMessageProp
}
