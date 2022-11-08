/**
 * A window for setting filters to constrain which parts of the data are shown.
 * At the top level, there is a _list_ of filters that are combined by logical
 * AND. The filters themselves can be either
 * - a primitive _Infix_ filter, consisting of column, operator, and value,
 *   e.g. column: Name, operator: "contains", value: "Institut" => show only
 *   rows whose Name contains the substring "Institut".
 * - a boolean combination (AND, OR, NOT) of filters.
 * A filter that has just been created will be an Infix filter, but it can
 * be "promoted" to a compound filter with the Promote button. Compound
 * filters in turn can be turned back to Infix filters with the Demote button.
 * This makes building complex filter trees simple and dynamic.
 */
import React, { useState, useEffect, useRef, useCallback } from "react"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import AddBoxIcon from "@mui/icons-material/AddBox"
import {
    Popper,
    Paper,
    IconButton,
    Stack,
    Box,
    Typography,
} from "@mui/material"

import { ViewDescriptor } from "@intutable/lazy-views/dist/types"
import { TableColumn } from "types/rdg"
import {
    ConditionKind,
    Filter,
    PartialFilter,
    PartialSimpleFilter,
    FILTER_OPERATORS_LIST,
} from "types/filter"
import {
    wherePartial,
    and,
    stripPartialFilter,
    partialFilterEquals,
} from "utils/filter"
import { useAPI } from "context/APIContext"
import { useUpdateTimer } from "hooks/useUpdateTimer"
import { FilterEditor } from "./Filter"
import { SimpleFilterEditor } from "./SimpleFilter"

type FilterWindowProps = {
    anchorEl: Element | null
    /** The columns the user can choose to filter by. */
    columns: TableColumn[]
    /**
     * The real filters, from the back-end, currently constraining the
     * data being displayed.
     */
    activeFilters: Filter[]
    onHandleCloseEditor: () => void
    /** Callback for saving filters (write to back-end) */
    onUpdateFilters: (newFilters: Filter[]) => Promise<void>
}

/**
 * There are no IDs on the filters, so this component has to manage them.
 * This type pairs a filter with a key.
 */
type KeyedFilter = {
    key: string | number
    filter: PartialFilter
}

const UPDATE_WAIT_TIME = 500

/**
 * A pop-up window with a list of filters to apply to the data being shown.
 */
export const FilterWindow: React.FC<FilterWindowProps> = props => {
    const { columns, activeFilters, onHandleCloseEditor, onUpdateFilters } =
        props
    /**
     * `Popper` does not work with `ClickAwayListener`, so we hacked this to
     * at least close the editor window whenever the user switches views.
     */
    const { view } = useAPI()
    const viewRef = useRef<ViewDescriptor | null>()
    useEffect(() => {
        viewRef.current = view
    }, [view])
    const prevView = viewRef.current
    useEffect(() => {
        if (prevView && prevView.id !== view?.id) onHandleCloseEditor()
    }, [view, prevView, onHandleCloseEditor])

    /** Attaching keys to the filters. */
    const nextKey = useRef<number>(0)
    const getNextKey = () => {
        const key = nextKey.current
        nextKey.current = nextKey.current + 1
        return key
    }
    const newUnsavedFilter = (): KeyedFilter => ({
        key: getNextKey(),
        filter: {
            kind: ConditionKind.Infix,
            operator: FILTER_OPERATORS_LIST[0].raw,
        },
    })

    /**
     * The actual filters currently being displayed - initially taken from
     * the back-end, later defined by what the user enters.
     */
    const setupInitialFilters = (filters: Filter[]): KeyedFilter[] => {
        if (filters.length !== 0)
            return filters.map(f => ({
                key: getNextKey(),
                filter: f,
            }))
        else return [newUnsavedFilter()]
    }
    const [filters, setFilters] = useState<KeyedFilter[]>(() =>
        setupInitialFilters(activeFilters)
    )

    /**
     * Save filters to the back-end and apply them. Rather than a save button,
     * we simply save whenever the user changes properties of a filter,
     * but with a 500ms timer to prevent things from being constantly updated.
     */
    const applyFilters = useCallback(() => {
        onUpdateFilters(extractFilters(filters))
        return Promise.resolve(null)
    }, [onUpdateFilters, filters])
    const { update } = useUpdateTimer<null>(applyFilters, UPDATE_WAIT_TIME)

    useEffect(() => {
        // if the new filters are semantically different from the old ones,
        // save and apply them.
        const newActiveFilters = extractFilters(filters)
        if (
            activeFilters.length !== newActiveFilters.length ||
            !(activeFilters as PartialFilter[]).every((f, i) =>
                partialFilterEquals(f, newActiveFilters[i])
            )
        )
            update()
    }, [activeFilters, update, filters])

    const handleAddFilter = () =>
        setFilters(prev => prev.concat(newUnsavedFilter()))

    const handleDeleteFilter = async (key: number | string): Promise<void> => {
        const index = filters.findIndex(f => f.key === key)
        if (index !== -1) setFilters(prev => arrayRemove(prev, index))
    }

    const handlePromoteFilter = async (
        key: number | string,
        filter: PartialSimpleFilter
    ) =>
        handleChangeFilter(
            key,
            and(filter, wherePartial(undefined, "=", undefined))
        )

    const handleChangeFilter = async (
        key: number | string,
        newFilter: PartialFilter
    ): Promise<void> => {
        const index = filters.findIndex(f => f.key === key)
        if (index === -1) return
        const newFilters = [...filters]
        newFilters[index] = { key, filter: newFilter }
        setFilters(newFilters)
    }

    return (
        <Popper open={props.anchorEl != null} anchorEl={props.anchorEl}>
            <Paper elevation={2} sx={{ padding: "16px" }}>
                <Stack>
                    <Box>
                        <Typography></Typography>
                        <IconButton
                            onClick={onHandleCloseEditor}
                            sx={{
                                float: "right",
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {filters &&
                        filters.map(f => (
                            <Box key={f.key} sx={{ display: "flex" }}>
                                {f.filter.kind === ConditionKind.Infix ? (
                                    <SimpleFilterEditor
                                        columns={columns}
                                        filter={f.filter}
                                        onPromote={async filter =>
                                            handlePromoteFilter(f.key, filter)
                                        }
                                        onChange={async filter =>
                                            handleChangeFilter(f.key, filter)
                                        }
                                        nestingDepth={0}
                                    />
                                ) : (
                                    <FilterEditor
                                        columns={columns}
                                        filter={f.filter}
                                        onDemote={async filter =>
                                            handleChangeFilter(f.key, filter)
                                        }
                                        onChange={async filter =>
                                            handleChangeFilter(f.key, filter)
                                        }
                                        nestingDepth={0}
                                    />
                                )}
                                <IconButton
                                    sx={{
                                        verticalAlign: "revert",
                                        float: "right",
                                    }}
                                    onClick={() => handleDeleteFilter(f.key)}
                                >
                                    <DeleteIcon sx={{ fontSize: "80%" }} />
                                </IconButton>
                            </Box>
                        ))}
                    <IconButton
                        onClick={handleAddFilter}
                        sx={{
                            borderRadius: "4px",
                            mt: 2,
                        }}
                    >
                        <AddBoxIcon />
                    </IconButton>
                </Stack>
            </Paper>
        </Popper>
    )
}

const arrayRemove = <A,>(a: Array<A>, i: number): Array<A> => {
    if (i < 0 || i >= a.length)
        throw TypeError(`arrayRemove: index out of bounds`)
    else return a.slice(0, i).concat(...a.slice(i + 1))
}

const extractFilters = (filters: KeyedFilter[]): Filter[] => {
    // yes, the type checker does need this.
    function notNull<T>(x: T | null): x is T {
        return x !== null
    }
    return filters.map(f => stripPartialFilter(f.filter)).filter(notNull)
}
