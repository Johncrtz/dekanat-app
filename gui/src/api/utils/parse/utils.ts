import { types as lv } from "@intutable/lazy-views"

const indexKey = "__columnIndex__"
export const byIndex = (a: lv.ColumnInfo, b: lv.ColumnInfo) =>
    (a.attributes[indexKey] as number) > (b.attributes[indexKey] as number)
        ? 1
        : -1
