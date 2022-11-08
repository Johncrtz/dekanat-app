/**
 * Following values are either json parsable or throw SyntaxError
 * .parse("hello") // SyntaxError
 * .parse("") // SyntaxError
 * .parse("1") // returns '1'
 * .parse("true") // returns 'true'
 * .parse("null") // returns 'null'
 * .parse("undefined") // SyntaxError
 * .parse("{}") // returns '{}'
 * .parse("[]") // returns '[]'
 *
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
 */
export const isJSON = (str: unknown): boolean => {
    if (typeof str !== "string") return false

    try {
        JSON.parse(str)
        return true
    } catch (e) {
        return false
    }
}

export const isJSONObject = (str: unknown): boolean => {
    if (typeof str !== "string") return false

    try {
        const parsed = JSON.parse(str)
        return (
            typeof parsed === "object" &&
            parsed != null &&
            Array.isArray(parsed) === false
        )
    } catch (e) {
        return false
    }
}

export const isJSONArray = (str: unknown): boolean => {
    if (typeof str !== "string") return false

    try {
        const parsed = JSON.parse(str)
        return Array.isArray(parsed)
    } catch (e) {
        return false
    }
}
