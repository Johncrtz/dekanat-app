import { ColumnInfo, ColumnSpecifier } from "@intutable/lazy-views"
import { Column } from "types"
import { isNumber } from "utils/isNumber"

/** Convert a column coming from the DB to a serialized stub of a RDG column. */
export const parse = (column: ColumnInfo): Column.Serialized => ({
    _id: column.id,
    _kind: column.attributes._kind,
    _cellContentType: column.attributes._cellContentType,
    __columnIndex__: column.attributes.__columnIndex__,
    name: column.attributes.displayName,
    key: column.key,
    width: isNumber(column.attributes.width), // this only ensures that stringified numbers will be parsed, nothing more
    minWidth: isNumber(column.attributes.minWidth), // this only ensures that stringified numbers will be parsed, nothing more
    maxWidth: isNumber(column.attributes.maxWidth), // this only ensures that stringified numbers will be parsed, nothing more
    cellClass: column.attributes.cellClass,
    headerCellClass: column.attributes.headerCellClass,
    summaryCellClass: column.attributes.summaryCellClass,
    summaryFormatter: column.attributes.summaryFormatter,
    groupFormatter: column.attributes.groupFormatter,
    editable:
        column.attributes.editable == null
            ? column.attributes.editable
            : Boolean(column.attributes.editable),
    colSpan: column.attributes.colSpan,
    frozen:
        column.attributes.frozen == null
            ? column.attributes.frozen
            : Boolean(column.attributes.frozen),
    resizable:
        column.attributes.resizable == null
            ? column.attributes.resizable
            : Boolean(column.attributes.resizable),
    sortable:
        column.attributes.sortable == null
            ? column.attributes.sortable
            : Boolean(column.attributes.sortable),
    sortDescendingFirst:
        column.attributes.sortDescendingFirst == null
            ? column.attributes.sortDescendingFirst
            : Boolean(column.attributes.sortDescendingFirst),

    headerRenderer: column.attributes.headerRenderer,
})

/**
 * Convert a serialized RDG column to a ColumnSpecifier for creating a
 * column in the DB.
 */
export const deparse = (
    column: Column.Serialized,
    colId: ColumnSpecifier["parentColumnId"]
): ColumnSpecifier => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, name, _id, ...col } = column

    const attributes: Column.SQL = {
        ...col,
        userPrimary: 0,
        displayName: name,
        width:
            typeof column.width === "number"
                ? column.width.toString()
                : column.width, // this only ensures that numbers get parsed back to strings, nothing more
        minWidth:
            typeof column.minWidth === "number"
                ? column.minWidth.toString()
                : column.minWidth, // this only ensures that numbers get parsed back to strings, nothing more
        maxWidth:
            typeof column.maxWidth === "number"
                ? column.maxWidth.toString()
                : column.maxWidth, // this only ensures that numbers get parsed back to strings, nothing more
        editable: column.editable ? 1 : 0,
        frozen: column.frozen ? 1 : 0,
        resizable: column.resizable ? 1 : 0,
        sortable: column.sortable ? 1 : 0,
        sortDescendingFirst: column.sortDescendingFirst ? 1 : 0,
    }

    return {
        parentColumnId: colId,
        attributes,
    }
}

export const isInternalColumn = (column: ColumnInfo): boolean =>
    column.name === "_id"
