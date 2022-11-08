/**
 * Returns a hash code from a string
 * @param  {string} str The string to hash.
 * @return {number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export const hash = (str: string): number => {
    let hash = 0
    for (let i = 0, len = str.length; i < len; i++) {
        const chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}
