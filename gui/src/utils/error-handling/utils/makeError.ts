import { inspect } from "util"
import { ErrorObject, isErrorObject } from "./ErrorObject"
import { getLastErrorFromChain } from "./getLastErrorFromChain"

/**
 * // TODO: since Response objects with status of 4xx-5xx gets thrown,
 * this case must be considered
 */

/**
 * Often error objects are casted of type unknown (e.g. in catch-blocks).
 * Most of the time these are Error instances and need to be casted.
 *
 * This will return an Error instance no matter what `value` is.
 * In case nothing useful is given, it will return an Error that states out
 * that the error could not be parsed.
 */
export const makeError = (value: unknown): Error => {
    if (isErrorObject(value)) {
        const errorObject = getLastErrorFromChain(value as ErrorObject)
        return new Error(errorObject.error as string)
    }

    if (value instanceof Error) return value

    if (value instanceof Response) return new Error(value.statusText)

    return new Error(
        `Unparsable Error: tried to handle the following error but could not parse it: ${inspect(
            value
        )}`
    )
}
