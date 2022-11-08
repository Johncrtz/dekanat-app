/** Replace all booleans with 0 or 1 in a given type. */
export type SqlData<A> = A extends boolean
    ? number
    : A extends Record<string, unknown>
    ? { [k in keyof A]: A[k] extends boolean ? number : SqlData<A[k]> }
    : A

/** Replace all booleans with 0 or 1 in a given value. */
export function toSql(obj: boolean): SqlData<boolean>
export function toSql(
    obj: Record<string, unknown>
): SqlData<Record<string, unknown>>
export function toSql(obj: unknown): SqlData<unknown> {
    if (typeof obj === "boolean") return obj ? 1 : 0
    else if (typeof obj === "object" && obj !== null)
        return Object.getOwnPropertyNames(obj).reduce(
            (acc, prop) =>
                Object.assign(acc, {
                    [prop]: toSql(obj[prop as keyof typeof obj]),
                }),
            {}
        )
    else return obj
}

// uh, slightly incomplete.
export const ATTRIBUTES = {
    COLUMN_INDEX: {
        key: "__columnIndex__",
    },
}
