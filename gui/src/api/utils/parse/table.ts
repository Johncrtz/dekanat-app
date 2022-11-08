import { ViewData } from "@intutable/lazy-views"
import type { TableData } from "types"
import { Column as ColumnParser } from "."
import { byIndex } from "./utils"

export const parse = (view: ViewData): TableData.Serialized => {
    const indexColumn = view.columns.find(c => c.attributes._kind === "index")!
    return {
        metadata: {
            descriptor: view.descriptor,
            source: view.source,
            joins: view.joins,
            columns: view.columns,
        },
        columns: view.columns
            .sort(byIndex)
            .filter(col => !ColumnParser.isInternalColumn(col))
            .map(ColumnParser.parse),
        rows: view.rows.map(r => ({
            ...r,
            _id: r["_id"] as number,
            __rowIndex__: r[indexColumn.key] as number,
        })),
    }
}
