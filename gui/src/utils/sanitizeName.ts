/** Reduce a table/column/whatever name to a DB-safe ascii string */
const sanitizeName = (name: string): string =>
    name
        .split("")
        .map(spaceToUnderscore)
        .map(c => c.toLowerCase())
        .filter(isSimple)
        .join("")

const spaceToUnderscore = (char: string): string => {
    if (char.length !== 1) throw TypeError(`expected single char, got: ${char}`)
    else return char.match(/^\s$/) ? "_" : char
}

const isSimple = (char: string): boolean => {
    if (char.length !== 1) throw TypeError(`expected single char, got: ${char}`)
    else return !!char.match(/^[a-zA-Z0-9-_]$/)
}

export default sanitizeName
