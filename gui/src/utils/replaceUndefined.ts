import Obj from "types/Obj"
import { Convert } from "types/Convert"

/**
 * Utility that recursivley replaces 'undefined' by 'null' in a plain object.
 * @param {Obj} obj
 * @returns {Convert<typeof obj>}
 */
export const replaceUndefined = (
    obj: Obj
): Convert<undefined, null, typeof obj> => {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key]

            // when it's an object itself
            if (
                typeof value === "object" &&
                value != null &&
                Array.isArray(value) === false
            )
                replaceUndefined(value as Obj)

            // when the value is undefined
            if (value === undefined) obj[key] = null
        }
    }
    return obj
}
