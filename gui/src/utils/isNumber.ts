type NotNumber<T> = T extends number ? never : T

/**
 * @description If value is parsable as a number it will return
 * the parsed value as a number or just the number.
 * @param {unknown} value
 * @returns {boolean}
 */
export const isNumber = <T>(value: T): number | NotNumber<T> => {
    if (typeof value === "number") return value as number

    if (typeof value !== "string") return value as NotNumber<T>

    const num = Number.parseInt(value)
    if (isNaN(num) === false) return num

    const float = Number.parseFloat(value)
    if (isNaN(float) === false) return float

    return value as unknown as NotNumber<T>
}
