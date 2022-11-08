import { ErrorObject, isErrorObject } from "./ErrorObject"

/**
 * Sometime @type {ErrorObject}'s are chained like `{error: {error: {error: "this a error message"}}}`.
 * This utilily will return the last @type {ErrorObject} from the chain
 */
export const getLastErrorFromChain = (error: ErrorObject): ErrorObject => {
    let returnValue: ErrorObject = error
    while (isErrorObject(returnValue.error)) {
        returnValue = returnValue.error
    }
    return returnValue
}
