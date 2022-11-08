import { types as lv } from "@intutable/lazy-views"

export const CHANNEL = "dekanat-app-plugin"

/**
 * Create a column in a table view, optionally (default is yes) adding it
 * to all of the table's filter views.
 * PM column must already be present.
 */
export function addColumnToTable(
    sessionID: string,
    tableId: lv.ViewDescriptor["id"],
    column: lv.ColumnSpecifier,
    joinId: number | null = null,
    /**
     * @param {boolean} createInViews if true (default) also create a
     * corresponding column in all of the table's views.
     */
    createInViews = true
) {
    return {
        channel: CHANNEL,
        method: addColumnToTable.name,
        sessionID,
        tableId,
        column,
        joinId,
        createInViews,
    }
}

/**
 * Add a column of a table to all views. It must already be present
 * in the table.
 */
export function addColumnToViews(
    sessionID: string,
    tableId: lv.ViewDescriptor["id"],
    column: lv.ColumnSpecifier
) {
    return {
        channel: CHANNEL,
        method: addColumnToViews.name,
        sessionID,
        tableId,
        column,
    }
}

/**
 * Remove a column from a table view and all its filter views.
 */
export function removeColumnFromTable(
    sessionID: string,
    tableId: lv.ViewDescriptor["id"],
    columnId: lv.ColumnInfo["id"]
) {
    return {
        channel: CHANNEL,
        method: removeColumnFromTable.name,
        sessionID,
        tableId,
        columnId,
    }
}

/**
 * Change the attributes of a column of a table, and optionally all its views.
 * All boolean values in the attributes are changed into ones and zeros,
 * other than that no transformation takes place.
 */
export function changeTableColumnAttributes(
    sessionID: string,
    tableId: lv.ViewDescriptor["id"],
    columnId: lv.ColumnInfo["id"],
    update: Record<string, unknown>,
    changeInViews = true
) {
    return {
        channel: CHANNEL,
        method: changeTableColumnAttributes.name,
        sessionID,
        tableId,
        columnId,
        update,
        changeInViews,
    }
}
