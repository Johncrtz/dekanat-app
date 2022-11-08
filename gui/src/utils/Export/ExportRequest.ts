import { ColumnInfo } from "@intutable/lazy-views"

/**
 * Options regarding the export of a view
 */
export type ExportOptions = {
    /** columns that should be exported */
    columnSelection: ColumnInfo["id"][]
    /** if rows are selected/marked and the user wants to exclude non-selected rows */
    rowSelection?: number[]
    /** if empty rows should be skipped or not @default false */
    includeEmptyRows?: boolean
    /** Wether column headlines should be exported @default false */
    includeHeader?: boolean
}

/**
 * Each requested export needs to send this object to the API.
 */
export type ExportRequest = {
    /** Timestamp of the request */
    date: Date
    options: ExportOptions
    file: {
        /** Name of the file */
        name: string
        /** Exported format */
        format: "csv"
        /** If set to true, a timestamp will be added to the filename @default true */
        excludeDateString?: boolean
    }
}
