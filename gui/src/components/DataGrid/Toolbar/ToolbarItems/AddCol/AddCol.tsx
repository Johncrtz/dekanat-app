import AddIcon from "@mui/icons-material/ViewColumn"
import { Button } from "@mui/material"
import { useSnackbar } from "notistack"
import React, { useState } from "react"
import { AddColumnModal } from "./AddColumnModal"
import { StandardColumnSpecifier, useColumn } from "hooks/useColumn"

/**
 * Toolbar Item for adding cols to the data grid.
 */
const AddCol: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar()
    const [anchorEL, setAnchorEL] = useState<Element | null>(null)
    const handleOpenModal = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setAnchorEL(event.currentTarget)
    }
    const handleCloseModal = () => setAnchorEL(null)

    const { createColumn } = useColumn()

    const handleCreateColumn = async (col: StandardColumnSpecifier) => {
        try {
            await createColumn(col)
        } catch (error) {
            enqueueSnackbar("Die Spalte konnte nicht erstellt werden!", {
                variant: "error",
            })
        }
    }

    return (
        <>
            <Button startIcon={<AddIcon />} onClick={handleOpenModal}>
                Add Col
            </Button>
            <AddColumnModal
                open={anchorEL != null}
                onClose={handleCloseModal}
                onHandleCreateColumn={handleCreateColumn}
            />
        </>
    )
}
export default AddCol
