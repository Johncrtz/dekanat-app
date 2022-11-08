/** Default row options for a new table view. */
import {
    ParentColumnDescriptor,
    RowOptions,
    SortOrder,
} from "@intutable/lazy-views/dist/types"
import { toSql, ATTRIBUTES as A } from "../../shared/dist/attributes"

export const UID_KEY = "_id"
export const INDEX_KEY = "index"
/** Minimum width of a column. */
export const COLUMN_MIN_WIDTH = 128

/**
 * Blank row options - no filters, no grouping, no sorting.
 */
export function emptyRowOptions(): RowOptions {
    return {
        conditions: [],
        groupColumns: [],
        sortColumns: [],
    }
}

/**
 * Default row options: obviously no filtering or grouping. Only order by
 * index, to keep rows from jumping around when you edit them.
 */
export function defaultRowOptions(
    /**
     * The interface {@link ParentColumnDescriptor} can take columns of
     * a table or a view. */
    columns: ParentColumnDescriptor[]
): RowOptions {
    const indexColumn = columns.find(c => c.name === INDEX_KEY)!
    return {
        conditions: [],
        groupColumns: [],
        sortColumns: [
            {
                column: { parentColumnId: indexColumn.id, joinId: null },
                order: SortOrder.Ascending,
            },
        ],
    }
}

export function defaultViewName() {
    return "Standard"
}

export function standardColumnAttributes(
    displayName: string,
    contentType: string,
    columnIndex?: number,
    userPrimary?: boolean
): Record<string, unknown> {
    return toSql({
        _kind: "standard",
        ...(userPrimary !== undefined && { userPrimary }),
        displayName,
        [A.COLUMN_INDEX.key]: columnIndex,
        editable: 1,
        _cellContentType: contentType,
        minWidth: COLUMN_MIN_WIDTH,
    })
}

export function linkColumnAttributes(
    displayName: string,
    columnIndex?: number
): Record<string, unknown> {
    return toSql({
        _kind: "link",
        displayName,
        [A.COLUMN_INDEX.key]: columnIndex,
        editable: 1,
        _cellContentType: "string",
        minWidth: COLUMN_MIN_WIDTH,
    })
}

export function lookupColumnAttributes(
    displayName: string,
    contentType: string,
    columnIndex?: number
): Record<string, unknown> {
    return toSql({
        _kind: "lookup",
        displayName,
        [A.COLUMN_INDEX.key]: columnIndex,
        editable: 0,
        _cellContentType: contentType,
        minWidth: COLUMN_MIN_WIDTH,
    })
}

export function indexColumnAttributes(
    columnIndex?: number
): Record<string, unknown> {
    return toSql({
        displayName: "Index",
        _kind: "index",
        _cellContentType: "number",
        [A.COLUMN_INDEX.key]: columnIndex,
        editable: false,
        resizable: true,
        sortable: true,
        width: 80,
    })
}
