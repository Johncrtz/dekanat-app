import { ColumnInfo } from "@intutable/lazy-views/dist/types"
import ContentPasteIcon from "@mui/icons-material/ContentPaste"
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material"
import { useSelectedRows } from "context/SelectedRowsContext"
import { useSnacki } from "hooks/useSnacki"
import { useView } from "hooks/useView"
import React, { useCallback } from "react"
import { HeaderRendererProps } from "react-data-grid"
import { Column, Row } from "types"
import { ColumnUtility } from "utils/ColumnUtility"

export type ColumnToClipboardProps = {
    headerRendererProps: HeaderRendererProps<Row>
    colInfo: ColumnInfo
}

export const ColumnToClipboard: React.FC<ColumnToClipboardProps> = props => {
    const { headerRendererProps, colInfo: col } = props

    const { selectedRows } = useSelectedRows()

    const { data: viewData } = useView()
    const { snackInfo } = useSnacki()

    const handleCopyToClipboard = useCallback(() => {
        const viewColInfo = viewData?.metaColumns.find(
            c => c.parentColumnId === col.id
        )
        if (viewColInfo == null) return

        // get values
        let values = viewData!.rows
            .map(row => row[viewColInfo!.key])
            .filter(e => e != null)

        // consider row selection
        if (
            headerRendererProps.allRowsSelected === false &&
            selectedRows.size > 0
        ) {
            values = viewData!.rows
                .map(row => {
                    const value = row[viewColInfo!.key]
                    if (selectedRows.has(row.__rowIndex__)) return value
                })
                .filter(e => e != null)
        }

        const util = new ColumnUtility(
            props.headerRendererProps.column as Column.Serialized
        )

        values = values
            .filter(val => val != null && val !== "")
            .map(val => util.cell.export(val))

        navigator.clipboard.writeText(values.join(", "))

        snackInfo("In die Zwischenablage kopiert!")
    }, [
        viewData,
        headerRendererProps.allRowsSelected,
        selectedRows,
        props.headerRendererProps.column,
        snackInfo,
        col.id,
    ])

    return (
        <MenuItem onClick={handleCopyToClipboard}>
            <ListItemIcon>
                <ContentPasteIcon />
            </ListItemIcon>

            <ListItemText>
                {/* Note: when a row is selected and the email is invalid, it will still count the row */}
                {headerRendererProps.allRowsSelected || selectedRows.size === 0
                    ? "Alle Werte"
                    : selectedRows.size === 1
                    ? "Einen Wert"
                    : selectedRows.size + " Werte"}{" "}
                in die Zwischenablage kopieren
            </ListItemText>
        </MenuItem>
    )
}
