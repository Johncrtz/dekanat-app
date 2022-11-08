import * as c from "@intutable/lazy-views/dist/condition"
import {
    FilterOperator,
    FILTER_OPERATORS,
    MkFilter,
    Filter,
    SimpleFilter,
    PartialFilter,
    PartialSimpleFilter,
} from "types/filter"

const Infix = c.ConditionKind.Infix
const Not = c.ConditionKind.Not
const And = c.ConditionKind.And
const Or = c.ConditionKind.Or

/**
 * Check if a string is a valid filter operator.
 */
export const isFilterOperator = (o: string): o is FilterOperator =>
    Object.getOwnPropertyNames(FILTER_OPERATORS).includes(o)

/**
 * Convenience function for making infix conditions without having to
 * specify all the kind discriminators.
 */
export const where = (
    left: c.ParentColumnSpecifier,
    operator: FilterOperator,
    right: c.Literal["value"]
): SimpleFilter => ({
    kind: Infix,
    left: { kind: c.OperandKind.Column, column: left },
    operator,
    right: { kind: c.OperandKind.Literal, value: right },
})

/**
 * Convenience function for making partial infix conditions without having to
 * specify all the kind discriminators.
 */
export const wherePartial = (
    left: c.ParentColumnSpecifier | undefined,
    operator: FilterOperator,
    right: c.Literal["value"] | undefined
): PartialSimpleFilter => ({
    kind: Infix,
    ...(left && { left: { kind: c.OperandKind.Column, column: left } }),
    operator,
    ...(right && { right: { kind: c.OperandKind.Literal, value: right } }),
})

/** Utility function for negating a condition */
export function not<I extends c.IsInfixCondition>(
    condition: MkFilter<I>
): MkFilter<I> {
    return { kind: Not, condition }
}

/** Utility function for making AND conditions. */
export function and<I extends c.IsInfixCondition>(
    left: MkFilter<I>,
    right: MkFilter<I>
): MkFilter<I> {
    return { kind: And, left, right }
}

/** Utility function for making OR conditions. */
export function or<I extends c.IsInfixCondition>(
    left: MkFilter<I>,
    right: MkFilter<I>
): MkFilter<I> {
    return { kind: Or, left, right }
}

/**
 * Compare two {@link PartialFilter}s for equality. Also works with
 * {@link Filter}, since `PartialFilter` is a supertype of `Filter`.
 */
export const partialFilterEquals = (
    f1: PartialFilter,
    f2: PartialFilter
): boolean => {
    switch (f1.kind) {
        case And:
            return (
                f2.kind === c.ConditionKind.And &&
                partialFilterEquals(f1.left, f2.left) &&
                partialFilterEquals(f1.right, f2.right)
            )
        case Or:
            return (
                f2.kind === c.ConditionKind.Or &&
                partialFilterEquals(f1.left, f2.left) &&
                partialFilterEquals(f1.right, f2.right)
            )
        case Not:
            return (
                f2.kind === c.ConditionKind.Not &&
                partialFilterEquals(f1.condition, f2.condition)
            )
        case Infix:
            return (
                f2.kind === c.ConditionKind.Infix &&
                partialSimpleFilterEquals(f1, f2)
            )
    }
}
/**
 * Check if two {@link PartialSimpleFilter}s are equal.
 */
export const partialSimpleFilterEquals = (
    f1: PartialSimpleFilter,
    f2: PartialSimpleFilter
) =>
    f1.left?.column.parentColumnId === f2.left?.column.parentColumnId &&
    f1.left?.column.joinId === f2.left?.column.joinId &&
    f1.operator === f2.operator &&
    f1.right?.value === f2.right?.value

/**
 * Check if a {@link PartialSimpleFilter} is also a {@link SimpleFilter}
 * (and can be applied to restrict data)
 */
export const isValidFilter = (
    filter: PartialSimpleFilter
): filter is SimpleFilter =>
    filter.left !== undefined &&
    filter.operator !== undefined &&
    filter.right !== undefined &&
    filter.right.value !== ""

/**
 * Strip away all partial leaf nodes in a {@link PartialFilter}, producing a
 * {@link Filter}. "Strip away" means treat them like identity elements as
 * much as possible: for example, consider the filter AND(f1, f2), where
 * f1 is valid, but f2 is not. Then, treat f2 as TRUE (identity element)
 * and return f1.
 * If all leaf nodes in the filter are incomplete, return null.
 */
export const stripPartialFilter = (p: PartialFilter): Filter | null => {
    switch (p.kind) {
        case Infix:
            if (isValidFilter(p)) return p
            else return null
        case Not: {
            const child = stripPartialFilter(p.condition)
            if (child === null) return null
            else return not(child)
        }
        case And: {
            const leftAnd = stripPartialFilter(p.left)
            const rightAnd = stripPartialFilter(p.right)
            if (leftAnd === null && rightAnd === null) return null
            else if (leftAnd === null) return rightAnd
            else if (rightAnd === null) return leftAnd
            else return and(leftAnd, rightAnd)
        }
        case Or: {
            const leftOr = stripPartialFilter(p.left)
            const rightOr = stripPartialFilter(p.right)
            if (leftOr === null && rightOr === null) return null
            else if (leftOr === null) return rightOr
            else if (rightOr === null) return leftOr
            else return or(leftOr, rightOr)
        }
    }
}
