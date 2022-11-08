/**
 * This module defines the type {@link MkFilter} as a limited subset of the
 * view plugin's condition type for use in the GUI. A Filter restricts
 * the set of rows shown, much like a WHERE clause in SQL.
 */
import * as c from "@intutable/lazy-views/dist/condition"

export {
    ConditionKind,
    OperandKind,
} from "@intutable/lazy-views/dist/condition"
export type { Column, Literal } from "@intutable/lazy-views/dist/condition"

/**
 * A filter  - may be any boolean combination of {@link SimpleFilter}s.
 */
export type MkFilter<Infix extends c.IsInfixCondition> =
    | Infix
    | c.MkAndCondition<MkFilter<Infix>>
    | c.MkOrCondition<MkFilter<Infix>>
    | c.MkNotCondition<MkFilter<Infix>>

export type Filter = MkFilter<SimpleFilter>

/**
 * A primitive infix-type (column = value, column < value, etc.) filter.
 */
export type SimpleFilter = c.MkInfixCondition<
    LeftOperand,
    FilterOperator,
    RightOperand
>
/**
 * The left operand to a filter may only be a column (for now).
 */
export type LeftOperand = Exclude<c.Operand, c.Literal | c.Subquery>
/**
 * The right operand to a filter may only be a literal value (for now)
 */
export type RightOperand = Exclude<c.Operand, c.Column | c.Subquery>

export type FilterOperator = keyof FilterOperatorMap

/**
 * A map of all available filter infix operators with some
 * {@link OperatorDescriptor | properties}.
 */
export type FilterOperatorMap = {
    "=": { pretty: "=" }
    "!=": { pretty: "!=" }
    "<": { pretty: "<" }
    ">": { pretty: ">" }
    "<=": { pretty: "<=" }
    ">=": { pretty: ">=" }
    LIKE: { pretty: "contains" }
}

/**
 * Describes an infix operator
 */
export type OperatorDescriptor = {
    /**
     * @prop {FilterOperator} raw The operator in SQL, passed to the LV plugin
     * directly
     */
    raw: FilterOperator
    /**
     * @prop {string} pretty The operator's pretty version, e.g. "contains"
     * instead of "LIKE".
     */
    pretty: string
}
/**
 * {@link FilterOperatorMap}, but as a value, so we can iterate over it, etc.
 */
export const FILTER_OPERATORS: FilterOperatorMap = {
    "=": { pretty: "=" },
    "!=": { pretty: "!=" },
    "<": { pretty: "<" },
    ">": { pretty: ">" },
    "<=": { pretty: "<=" },
    ">=": { pretty: ">=" },
    LIKE: { pretty: "contains" },
}
export const FILTER_OPERATORS_LIST: OperatorDescriptor[] = (
    Object.getOwnPropertyNames(FILTER_OPERATORS) as FilterOperator[]
).map(name => ({ ...FILTER_OPERATORS[name], raw: name }))
