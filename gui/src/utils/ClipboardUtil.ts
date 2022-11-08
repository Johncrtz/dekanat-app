import cells from "@datagrid/Cells"
import { CopyEvent, FillEvent, PasteEvent } from "react-data-grid"
import { Column, Row } from "types"

/** success if `error` is undefined */
type EventHandlerCallback = (error?: string) => void

type CopyEventHandler = {
    handleOnCopy: (
        event: CopyEvent<Row>,
        callback?: EventHandlerCallback
    ) => void // rdg event
    handleOnCopyMultiple: (callback?: EventHandlerCallback) => void // component functionality
}
type PasteEventHandler = {
    handleOnPaste: (
        event: PasteEvent<Row>,
        callback?: EventHandlerCallback
    ) => Row // rdg event
}
type FillEventHandler = {
    handleOnFill: (
        event: FillEvent<Row>,
        callback?: EventHandlerCallback
    ) => Row // rdg event
}
type ClipboardEvents = CopyEventHandler & PasteEventHandler & FillEventHandler

/**
 * NOTE: When you use these callbacks, don't forget to bind the 'this'-context.
 * Resp. do 'onEvent={e => instance.onCopy(e)}' instead of 'onEvent={instance.onCopy}'.
 */
export class ClipboardUtil implements ClipboardEvents {
    constructor(private columns: Column[]) {}

    private getColumn(key: string) {
        const column = this.columns.find(column => column.key === key)
        if (column == null)
            throw new Error(
                `Clipboard Event Handler: column with key '${key}' not found`
            )
        return column
    }

    private util(column: Column) {
        return cells.getCell(column._cellContentType!)
    }

    /** Copy Event – fires when a user copies a cell, e.g. cmd+c on a cell */
    public handleOnCopy(
        event: CopyEvent<Row>,
        callback?: EventHandlerCallback
    ) {
        try {
            const rawContent = event.sourceRow[event.sourceColumnKey]
            const column = this.getColumn(event.sourceColumnKey)

            const exportedContent = this.util(column).export(rawContent)

            navigator.clipboard.writeText(exportedContent ?? "")

            if (
                typeof exportedContent === "string" &&
                exportedContent.length > 0
            )
                callback?.()
        } catch (error) {
            callback?.("1 Zelle konnte nicht kopiert werden.")
        }
    }

    /** Copy Event – fires when the clicks to copy a whole column or only selected cells into the clipboard  */
    public handleOnCopyMultiple(callback?: EventHandlerCallback) {
        // TODO: implement
        return
    }

    /** Paste Event – fires when a user pastes content into cell, e.g. cmd+v on a cell */
    public handleOnPaste = (
        event: PasteEvent<Row>,
        callback?: EventHandlerCallback
    ) => {
        const { targetRow, targetColumnKey, sourceRow, sourceColumnKey } = event
        try {
            const sourceRawContent = sourceRow[sourceColumnKey]
            const targetColumn = this.getColumn(targetColumnKey)
            const sourceColumn = this.getColumn(sourceColumnKey)
            const sourceUtil = this.util(sourceColumn)
            const targetUtil = this.util(targetColumn)

            // use for debugging
            // console.table({
            //     source: {
            //         util: sourceUtil.brand,
            //         content: sourceRawContent,
            //         parsed: sourceUtil.parse(sourceRawContent),
            //     },
            //     target: {
            //         util: targetUtil.brand,
            //         "isValid (content)": targetUtil.isValid(sourceRawContent),
            //         "isValid (parsed)": targetUtil.isValid(
            //             sourceUtil.parse(sourceRawContent)
            //         ),
            //     },
            // })

            // passes source content the target validator?
            const parsed = sourceUtil.parse(sourceRawContent)
            if (targetUtil.isValid(parsed) === false) {
                callback?.("1 Zelle konnte nicht eingefügt werden.")
                return targetRow
            }

            callback?.()
            return {
                ...targetRow,
                [targetColumnKey]: sourceRawContent,
            }
        } catch (error) {
            callback?.("1 Zelle konnte nicht eingefügt werden.")
            return targetRow
        }
    }

    // BUG: // TODO: handle fill is currently not working / implemented bc of missing css?
    /** Fill Event – fires when a user drags a cell across multiple other cells of that column to override them  */
    public handleOnFill(
        event: FillEvent<Row>,
        callback?: EventHandlerCallback
    ) {
        const { sourceRow, columnKey, targetRow } = event
        return { ...targetRow, [columnKey]: sourceRow[columnKey as keyof Row] }
    }
}
