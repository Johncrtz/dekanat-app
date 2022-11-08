/**
 * Validates if a new name for e.g. project/table matches the pattern (only letters).
 * @param {string} name
 * @returns {true | Error} true in case of success, otherwise an Error object will be returned w/ a message that can be shown to the user
 */
export const isValidName = (name: string): true | Error => {
    const letters = /^[a-zA-Z]+$/
    if (!letters.test(name))
        return new Error("The Name must contain only letters!")
    return true
}

/**
 * Trims whitespace
 * @param {string} name
 * @returns {string} the new name
 */
export const prepareName = (name: string): string => name.trim()
