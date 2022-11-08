import FileDownloadIcon from "@mui/icons-material/FileDownload"
import { IconButton, Tooltip } from "@mui/material"
import { useSelectedRows } from "context/SelectedRowsContext"
import { useView } from "hooks/useView"
import React, { useState } from "react"
import { ExportViewDialog } from "./ExportViewDialog"

/**
 * Button w/ options for exporting the data to several file formats
 */
const ExportView: React.FC = () => {
    const [anchorEL, setAnchorEL] = useState<Element | null>(null)
    const openModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setAnchorEL(e.currentTarget)
    }
    const closeModal = () => setAnchorEL(null)

    const { selectedRows } = useSelectedRows()
    const { data } = useView()

    const allRowsSelected = data
        ? data.rows.length === selectedRows.size
        : false

    return (
        <>
            <Tooltip title="View exportieren" arrow enterDelay={1000}>
                <IconButton onClick={openModal}>
                    <FileDownloadIcon />
                </IconButton>
            </Tooltip>
            <ExportViewDialog
                open={anchorEL != null}
                onClose={closeModal}
                allRowsSelected={allRowsSelected}
            />
        </>
    )
}
export default ExportView
