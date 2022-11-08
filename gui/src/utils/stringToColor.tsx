import { hash } from "utils/hash"
import { rgbToHex } from "utils/rgbToHex"

/**
 * Algorithm that maps a color to a string.
 *
 * It hashes the string and takes the first 3 bytes of the hash for r/g/b.
 *
 * This is atm the most easiest way to get a unique color for the same string value
 * in the column without using a context around.
 */
export const stringToColor = (str: string) => {
    let hashCode = hash(str)
    const red = hashCode & 0xff
    hashCode >>= 8
    const green = hashCode & 0xff
    hashCode >>= 8
    const blue = hashCode & 0xff
    return rgbToHex(red, green, blue)
}
