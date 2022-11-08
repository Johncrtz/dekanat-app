import { Column, Row, ViewData } from "types"
import { ColumnUtility } from "./ColumnUtility"
import { SelectColumn } from "react-data-grid"

export default class SerDes {
    constructor() {}

    /** not used atm */
    static serializeColumn(column: Column.Deserialized): Column.Serialized {
        // I copied this piece of code from the old codebase in order to be implemented, it needs a refactoring
        // but since it is not used atm, this can be done later
        return {
            ...column,
            _id: column._id!,
            _kind: column._kind!,
            _cellContentType: "string",
            __columnIndex__: column.__columnIndex__!,
            name: column.name as string,
            summaryFormatter: undefined, // currently not supported
            groupFormatter: undefined, // currently not supported
            editable: column.editable as boolean | undefined | null,
            cellClass: undefined, // currently not supported
            summaryCellClass: undefined, // currently not supported
            colSpan: undefined, // currently not supported
            headerRenderer: undefined, // supported but gets a default value in the deserializer
        }
    }

    /** deserialize a single column */
    static deserializeColumn(column: Column.Serialized): Column.Deserialized {
        const util = new ColumnUtility(column) // TODO: will be replaced by a proxy object

        return {
            ...column,
            editable: util.isEditable(),
            editor: util.getEditor(),
            formatter: util.getFormatter(),
            summaryFormatter: undefined, // currently not supported  // TODO: will be replaced by a proxy object with default settings
            groupFormatter: undefined, // currently not supported  // TODO: will be replaced by a proxy object with default settings
            colSpan: undefined, // currently not supported  // TODO: will be replaced by a proxy object with default settings
            editorOptions: util.getEditorOptions(),
            headerRenderer: util.getHeaderRenderer(),
        }
    }

    /** not used atm */
    static serializeRow(row: Row): Row {
        // TODO: has nothing to do with deserialization, should be moved in the parser
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __rowIndex__, ...serializedRow } = row // see `deserializeRow`
        return serializedRow as Row
    }

    /** deserialize a single row */
    static deserializeRow(row: Row, index: number): Row {
        return {
            ...row,
            // TODO: has nothing to do with deserialization, should be moved in the parser
            __rowIndex__: index, // TODO: Hack: __rowIndex__ is not saved in the database, the plugins keep the order of the rows. this should be removed in the future by saving the value and combining it with the index column
        } as Row
    }

    /** not used atm */
    static serializeView(view: ViewData.Deserialized): ViewData.Serialized {
        // serializes each row
        const rows: Row[] = view.rows.map(SerDes.serializeRow)

        // serialize each column
        const columns: Column.Serialized[] = view.columns.map(
            SerDes.serializeColumn
        )

        // remove selector column
        columns.shift()
        // remove rdg indice column
        columns.shift()

        return {
            ...view,
            columns,
            rows,
        }
    }

    /** deserialize a view */
    static deserializeView(view: ViewData.Serialized): ViewData.Deserialized {
        const deserializedRows: Row[] = view.rows.map(SerDes.deserializeRow) // will be obsolete
        const deserializedColumns: Column.Deserialized[] = view.columns.map(
            SerDes.deserializeColumn
        )

        // rdg's checkbox column for selecting rows
        deserializedColumns.unshift(SelectColumn)

        return {
            ...view,
            columns: deserializedColumns,
            rows: deserializedRows,
        }
    }
}
