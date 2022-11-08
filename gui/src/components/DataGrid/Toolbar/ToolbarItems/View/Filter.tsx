/**
 * An editor component for a nested (i.e. boolean combination) filter.
 */
import React from "react"
import {
    Select,
    SelectChangeEvent,
    MenuItem,
    IconButton,
    Box,
    Stack,
} from "@mui/material"
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease"
import * as c from "@intutable/lazy-views/dist/condition"
import { PartialFilter, PartialSimpleFilter } from "types/filter"
import { wherePartial, and, or, not, isValidFilter } from "utils/filter"
import { TableColumn } from "types/rdg"
import { SimpleFilterEditor } from "./SimpleFilter"
import { getFilterColor } from "./utils"

const Infix = c.ConditionKind.Infix
const Not = c.ConditionKind.Not
const And = c.ConditionKind.And
const Or = c.ConditionKind.Or

type FilterEditorProps = {
    /**
     * Only nested filters allowed; {@link PartialSimpleFilter}s get
     * {@link SimpleFilterEditor | their own component}.
     */
    filter: Exclude<PartialFilter, PartialSimpleFilter>
    /**
     * @prop {TableColumn[]} columns We filter by conditions of the form
     * "<column x> < 100", so we need to know what columns are
     * available in our table.
     */
    columns: TableColumn[]
    onChange: (newFilter: PartialFilter) => Promise<void>
    /** Change the filter to a {@link SimpleFilterEditor}. */
    onDemote: (p: PartialSimpleFilter) => Promise<void>
    /**
     * Deeply nested filters have different background colors to keep things
     * looking a bit more orderly.
     */
    nestingDepth: number
}

export const FilterEditor: React.FC<FilterEditorProps> = props => {
    const { filter, columns, onDemote, onChange, nestingDepth } = props

    const newFilter = () => wherePartial(undefined, "=", undefined)

    /** Handle a change in the kind selector (AND, OR, or NOT) */
    const handleChangeKind = (e: SelectChangeEvent<c.ConditionKind>) => {
        let kind = e.target.value
        if (typeof kind === "string") kind = And
        if (filter.kind === kind) return
        else if (filter.kind === Not) {
            if (kind === Infix) onChange(filter.condition)
            else if (kind === And) onChange(and(filter.condition, newFilter()))
            else onChange(or(filter.condition, newFilter()))
        } else {
            if (kind === Infix) onChange(filter.left)
            else if (kind === Not) onChange(not(filter.left))
            else if (kind === And) onChange(and(filter.left, filter.right))
            else onChange(or(filter.left, filter.right))
        }
    }

    /** For AND and OR filters: change the left branch */
    const handleChangeLeft = async (f: PartialFilter) => {
        if (filter.kind === And || filter.kind === Or)
            return onChange({ ...filter, left: f })
    }
    /** For AND and OR filters: change the right branch */
    const handleChangeRight = async (f: PartialFilter) => {
        if (filter.kind === And || filter.kind === Or)
            return onChange({ ...filter, right: f })
    }

    /**
     * Demote this filter to a simple filter, reverting to its left branch
     * (unless the right one is valid and the left one isn't.)
     * To keep things tidy, the demote button is only present on filters
     * whose children are both infix filters.
     */
    const handleDemote = async () => {
        if (hasOnlyLeafChildren(filter)) return onDemote(salvageBranch(filter))
        // these cases are just here for the type checker.
        else if (filter.kind === Not) return filter.condition
        else return filter.left
    }

    /**
     * Promote the inner filter of a NOT condition to a complex filter.
     * The default kind is AND.
     */
    const handlePromoteNot = async (f: PartialSimpleFilter) =>
        onChange(not(and(f, newFilter())))
    /**
     * Promote the left branch of an AND or OR condition to a complex filter.
     * The default kind is AND.
     */
    const handlePromoteLeft = async (f: PartialSimpleFilter) => {
        if (filter.kind === And || filter.kind === Or)
            return onChange({
                ...filter,
                left: and(f, newFilter()),
            })
    }
    /**
     * Promote the right branch of an AND or OR condition to a complex filter.
     * The default kind is AND.
     */
    const handlePromoteRight = async (f: PartialSimpleFilter) => {
        if (filter.kind === And || filter.kind === Or)
            return onChange({
                ...filter,
                right: and(f, newFilter()),
            })
    }

    /** Demote the inner filter of a NOT condition to a simple filter. */
    const handleDemoteNot = async (f: PartialSimpleFilter) => onChange(not(f))
    /** Demote the left branch of an AND or OR condition to a simple filter. */
    const handleDemoteLeft = async (f: PartialSimpleFilter) => {
        if (filter.kind === And || filter.kind === Or)
            return onChange({
                ...filter,
                left: f,
            })
    }
    /** Demote the right branch of an AND or OR condition to a simple filter. */
    const handleDemoteRight = async (f: PartialSimpleFilter) => {
        if (filter.kind === And || filter.kind === Or)
            return onChange({
                ...filter,
                right: f,
            })
    }

    return (
        <Box
            sx={{
                m: 0.5,
                p: 0.5,
                borderRadius: "4px",
                display: "flex",
                alignContent: "center",
                backgroundColor: getFilterColor(nestingDepth),
            }}
        >
            <Box sx={{ m: 0.5, p: 0.5 }}>
                <Select
                    value={filter.kind ?? And}
                    onChange={handleChangeKind}
                    sx={{
                        position: "relative",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <MenuItem key={Not} value={Not}>
                        NOT
                    </MenuItem>
                    <MenuItem key={And} value={And}>
                        AND
                    </MenuItem>
                    <MenuItem key={Or} value={Or}>
                        OR
                    </MenuItem>
                </Select>
            </Box>
            {filter.kind === Not ? (
                filter.condition.kind === Infix ? (
                    <SimpleFilterEditor
                        filter={filter.condition}
                        columns={columns}
                        onPromote={handlePromoteNot}
                        onChange={f => onChange(not(f))}
                        nestingDepth={nestingDepth}
                    />
                ) : (
                    <FilterEditor
                        filter={filter.condition}
                        columns={columns}
                        onDemote={handleDemoteNot}
                        onChange={f => onChange(not(f))}
                        nestingDepth={nestingDepth + 1}
                    />
                )
            ) : (
                <Stack spacing={1}>
                    {filter.left.kind === Infix ? (
                        <SimpleFilterEditor
                            filter={filter.left}
                            columns={columns}
                            onPromote={handlePromoteLeft}
                            onChange={handleChangeLeft}
                            nestingDepth={nestingDepth}
                        />
                    ) : (
                        <FilterEditor
                            filter={filter.left}
                            columns={columns}
                            onDemote={handleDemoteLeft}
                            onChange={handleChangeLeft}
                            nestingDepth={nestingDepth + 1}
                        />
                    )}
                    {filter.right.kind === Infix ? (
                        <SimpleFilterEditor
                            filter={filter.right}
                            columns={columns}
                            onPromote={handlePromoteRight}
                            onChange={handleChangeRight}
                            nestingDepth={nestingDepth}
                        />
                    ) : (
                        <FilterEditor
                            filter={filter.right}
                            columns={columns}
                            onDemote={handleDemoteRight}
                            onChange={handleChangeRight}
                            nestingDepth={nestingDepth + 1}
                        />
                    )}
                </Stack>
            )}
            {hasOnlyLeafChildren(filter) && (
                <IconButton
                    sx={{ verticalAlign: "revert" }}
                    onClick={handleDemote}
                >
                    <FormatIndentDecreaseIcon
                        sx={{
                            fontSize: "80%",
                            color: "#aa0000",
                        }}
                    />
                </IconButton>
            )}
        </Box>
    )
}

type HasOnlyLeafChildren =
    | c.MkNotCondition<PartialSimpleFilter>
    | c.MkAndCondition<PartialSimpleFilter>
    | c.MkOrCondition<PartialSimpleFilter>

const hasOnlyLeafChildren = (
    filter: Exclude<PartialFilter, PartialSimpleFilter>
): filter is HasOnlyLeafChildren =>
    (filter.kind === Not && filter.condition.kind === Infix) ||
    (filter.kind !== Not &&
        filter.left.kind === Infix &&
        filter.right.kind === Infix)

/**
 * On demotion, return the "more important" branch of the filter to use
 * as simple filter.
 */
const salvageBranch = (filter: HasOnlyLeafChildren): PartialSimpleFilter => {
    if (filter.kind === Not) return filter.condition
    else if (isValidFilter(filter.right) && !isValidFilter(filter.left))
        return filter.right
    else return filter.left
}
