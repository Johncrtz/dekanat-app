import type {
    InfixCondition,
    Condition,
} from "@intutable/lazy-views/dist/condition"
import {
    ConditionKind,
    OperandKind,
    mapCondition,
} from "@intutable/lazy-views/dist/condition"
import type { Filter, SimpleFilter } from "types/filter"
import { isFilterOperator, not, and, or } from "utils/filter"

/**
 * The (string) `contains` operator uses SQL `LIKE` under the hood,
 * which requires a pattern string, so we need to convert back and forth.
 */
export const LIKE_PATTERN_ESCAPE_CHARS = ["%", "_", "\\"]

/** Don't look, just a placeholdey hack - we're gonna change the simplefilter
 type a whole lot soon */
export const parse = (c: Condition): Filter => {
    switch (c.kind) {
        case ConditionKind.Not:
            return not(parse(c.condition))
        case ConditionKind.And:
            return and(parse(c.left), parse(c.right))
        case ConditionKind.Or:
            return or(parse(c.left), parse(c.right))
        case ConditionKind.Infix:
            return parseSimpleFilter(c)
        case ConditionKind.Boolean:
            throw TypeError(
                `{$parse.name}: Filter type may not contain any` +
                    ` trivial boolean conditions`
            )
    }
}

const parseSimpleFilter = (c: InfixCondition): SimpleFilter => {
    if (
        c.left.kind !== OperandKind.Column ||
        c.right.kind !== OperandKind.Literal ||
        !isFilterOperator(c.operator)
    )
        throw TypeError(
            `expected condition of type <column> - <filterOperator>` +
                ` - <string>, got: ${JSON.stringify(c)}`
        )
    else
        return {
            kind: c.kind,
            left: c.left,
            operator: c.operator,
            right: {
                ...c.right,
                value:
                    c.operator === "LIKE" && typeof c.right.value === "string"
                        ? unpackContainsValue(c.right.value)
                        : c.right.value,
            },
        }
}

/** Convert a filter from the lazy-views plugin to one the frontend can use. */
export const deparse = (f: Filter): Condition =>
    mapCondition(deparseSimpleFilter, f)

const deparseSimpleFilter = (f: SimpleFilter): InfixCondition => ({
    ...f,
    right: {
        ...f.right,
        value:
            f.operator === "LIKE" && typeof f.right.value === "string"
                ? packContainsValue(f.right.value)
                : f.right.value,
    },
})

/**
 * Convert the value a user enters in a `contains` condition to an SQL
 * pattern string (adding percent symbols, escaping special characters)
 */
export const packContainsValue = (value: string): string =>
    "%" +
    value
        .split("")
        .map(c => (LIKE_PATTERN_ESCAPE_CHARS.includes(c) ? "\\" + c : c))
        .join("") +
    "%"

/**
 * Parse the SQL `LIKE` pattern into a format without format and escape chars.
 */
export const unpackContainsValue = (value: string): string => {
    let acc = ""
    let lastWasBackslash = false
    const pos = 0
    for (const char of value.split("").slice(1, -1)) {
        if (!lastWasBackslash && char === "\\") {
            // saw a first backslash
            lastWasBackslash = true
        } else if (
            lastWasBackslash &&
            LIKE_PATTERN_ESCAPE_CHARS.includes(char)
        ) {
            // saw a backslash, now seeing \ % _
            lastWasBackslash = false
            acc = acc.concat(char)
        } else if (lastWasBackslash)
            // saw backslash, but not seeing an escapeable character after
            throw Error(
                `unpackContainsValue: unescaped \\ at ` + `position ${pos}`
            )
        else if (LIKE_PATTERN_ESCAPE_CHARS.includes(char))
            // seeing escapeable character without a backslash before it
            throw Error(
                `unpackContainsValue: unescaped ${char} at ` + `position ${pos}`
            )
        else acc = acc.concat(char)
    }
    return acc
}
