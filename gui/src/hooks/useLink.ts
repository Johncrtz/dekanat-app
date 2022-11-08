import { useMemo, useCallback } from "react"
import { ColumnInfo } from "@intutable/lazy-views/dist/types"
import { TableHookOptions, useTable } from "hooks/useTable"
import { TableRow, TableColumn } from "types"

export type RowPreview = {
    id: number
    text: string
}

/**
 * When manipulating tables that have links to other tables, those other tables
 * are loaded with this hook.
 */
export const useLink = (options: TableHookOptions) => {
    const { data: linkTableData, error, mutate } = useTable(options)

    const getPrimaryColumn = useCallback((): ColumnInfo | null => {
        if (linkTableData == null) return null
        return linkTableData.metadata.columns.find(
            c => c.attributes.userPrimary! === 1
        )!
    }, [linkTableData])

    const getRowId = useCallback(
        (row: TableRow): number => {
            const uidColumn = linkTableData!.metadata.columns.find(
                c => c.name === "_id"
            )!
            return row[uidColumn.key] as number
        },
        [linkTableData]
    )

    const getRowPreviews = useCallback((): RowPreview[] | null => {
        const primaryColumn = getPrimaryColumn()
        if (primaryColumn == null) return null
        return linkTableData!.rows.map(r => ({
            id: getRowId(r),
            text: r[primaryColumn.key] as string,
        }))
    }, [linkTableData, getPrimaryColumn, getRowId])

    /**
     * The user-primary column of the linked table. Used for giving a preview
     * of each row. Not to be confused with the back-end, SQL primary column.
     */
    const primaryColumn = useMemo(() => getPrimaryColumn(), [getPrimaryColumn])

    /**
     * A "preview" for each row. Currently consists of the value in
     * {@link primaryColumn} plus an ID.
     */
    const rowPreviews = useMemo(() => getRowPreviews(), [getRowPreviews])

    /**
     * Given a RDG column of the linked table, find the abstract back-end
     * column it corresponds to.
     */
    const getColumn = (column: TableColumn): ColumnInfo => {
        const tableColumn = linkTableData?.metadata.columns.find(
            c => c.key === column.key
        )
        if (!tableColumn) throw Error("no column with key ${column.key} found")
        return tableColumn
    }
    return {
        error,
        mutate,
        linkTableData,
        primaryColumn,
        rowPreviews,
        getColumn,
    }
}
