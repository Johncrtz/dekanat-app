/**
 * Allows to declare static properties with the help of decorators.
 */
export const static_implements =
    <T>() =>
    <U extends T>(constructor: U) => {
        constructor
    }
