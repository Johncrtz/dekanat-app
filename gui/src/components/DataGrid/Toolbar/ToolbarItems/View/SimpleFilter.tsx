/**
 * An editor component for one single, primitive filter. The filter applied
 * to the data consist of a boolean combination of these.
 * A Simple Filter has the form <column> <operator> <value>, e.g.:
 * "Name contains 'Institut'" or "Age >= 18"
 */
import React from "react"
import { IconButton } from "@mui/material"
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease"
import {
    Select,
    SelectChangeEvent,
    MenuItem,
    TextField,
    Box,
} from "@mui/material"
import {
    FILTER_OPERATORS_LIST,
    FilterOperator,
    Column,
    OperandKind,
    PartialSimpleFilter,
} from "types/filter"
import { TableColumn } from "types/rdg"
import { getFilterColor } from "./utils"

type SimpleFilterEditorProps = {
    /** When the user clicks "create new filter", a new filter with no data
     * in any of the input fields is generated. Also, a filter may have some
     * of its fields set, but not enough to send to the back-end yet, so we
     * can't just represent it with `null` or something.
     */
    filter: PartialSimpleFilter
    /**
     * We filter by conditions of the form
     * "<column x> < 100", so we need to know what columns are
     * available in our table.
     */
    columns: TableColumn[]
    /** Change the filter to a {@link FilterEditor | compound filter}. */
    onPromote: (filter: PartialSimpleFilter) => Promise<void>
    onChange: (newFilter: PartialSimpleFilter) => Promise<void>
    /**
     * Deeply nested filters have different background colors to keep things
     * looking a bit more orderly.
     */
    nestingDepth?: number
}

export const SimpleFilterEditor: React.FC<SimpleFilterEditorProps> = props => {
    const { columns, filter, onPromote, onChange } = props

    const getColumn = (columnId: number | string) => {
        const column = columns.find(c => c._id === columnId)
        return column ? { parentColumnId: column._id, joinId: null } : undefined
    }

    const handleChangeColumn = (e: SelectChangeEvent<number | string>) => {
        const newColumnSpec = getColumn(e.target.value)
        let newColumn: Column | undefined
        if (newColumnSpec)
            newColumn = {
                kind: OperandKind.Column,
                column: newColumnSpec,
            }
        else newColumn = undefined
        onChange({
            ...filter,
            left: newColumn,
        })
    }
    const handleChangeOperator = (e: SelectChangeEvent<FilterOperator>) =>
        onChange({
            ...filter,
            operator: e.target.value as FilterOperator,
        })
    const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange({
            ...filter,
            right: { kind: OperandKind.Literal, value: e.target.value },
        })

    return (
        <Box
            sx={{
                m: 0.5,
                p: 0.5,
                borderRadius: "4px",
                display: "flex",
                alignContent: "center",
                ...(props.nestingDepth && {
                    backgroundColor: getFilterColor(props.nestingDepth),
                }),
            }}
        >
            <Select
                value={filter.left?.column.parentColumnId ?? ""}
                onChange={handleChangeColumn}
                sx={{
                    mr: 1,
                }}
                size="small"
            >
                {columns.map(c => (
                    <MenuItem key={c._id} value={c._id}>
                        {c.name}
                    </MenuItem>
                ))}
            </Select>
            <Select
                value={filter.operator ?? ""}
                onChange={handleChangeOperator}
                sx={{
                    mr: 1,
                }}
                size="small"
            >
                {FILTER_OPERATORS_LIST.map(op => (
                    <MenuItem key={op.raw} value={op.raw}>
                        {op.pretty}
                    </MenuItem>
                ))}
            </Select>
            <TextField
                size="small"
                value={filter.right?.value ?? ""}
                onChange={handleChangeValue}
                sx={{
                    mr: 1,
                }}
            />
            <IconButton
                sx={{ verticalAlign: "revert" }}
                onClick={() => onPromote(filter)}
            >
                <FormatIndentIncreaseIcon
                    sx={{
                        fontSize: "80%",
                        color: "#00aa00",
                    }}
                />
            </IconButton>
        </Box>
    )
}
