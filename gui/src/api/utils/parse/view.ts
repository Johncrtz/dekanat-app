import { ViewData as RawViewData } from "@intutable/lazy-views"
import type { ViewData } from "types"
import { Column as ColumnParser, Filter as FilterParser } from "."
import { byIndex } from "./utils"

/**
 * Convert {@link RawViewData | ViewData} from the view plugin to a more
 * GUI-friendly format. Since we forgot to include the row options in the
 * `ViewData` type, we now have to fetch them separately for this function.
 * Oops.
 */
export const parse = (view: RawViewData): ViewData.Serialized => {
    const indexColumn = view.columns.find(c => c.attributes._kind === "index")!
    return {
        descriptor: view.descriptor,
        metaColumns: view.columns,
        filters: view.rowOptions.conditions.map(FilterParser.parse),
        sortColumns: view.rowOptions.sortColumns,
        groupColumns: view.rowOptions.groupColumns,
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
