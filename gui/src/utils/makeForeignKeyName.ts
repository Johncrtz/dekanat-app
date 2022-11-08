import { ViewInfo } from "@intutable/lazy-views"

/**
 * When linking tables, we need a foreign key column. This function creates
 * a unique name for that column.
 */
export default function makeForeignKeyName(viewInfo: ViewInfo) {
    // We pick a number greater than any join so far's ID...
    const nextJoinIndex = Math.max(0, ...viewInfo.joins.map(j => j.id)) + 1
    // and add a special character so that there can't be clashes with
    // user-added columns (see ./sanitizeName)
    const fkColumnName = `j#${nextJoinIndex}_fk`
    return fkColumnName
}
