import ClearIcon from "@mui/icons-material/Clear"
import { Box, IconButton } from "@mui/material"
import React from "react"

type DeleteButtonProps = {
    onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

/**
 * Delete button for erasing the content of a cell.
 */
export const DeleteButton: React.FC<DeleteButtonProps> = props => {
    return (
        <Box>
            <IconButton size="small" onClick={props.onDelete}>
                <ClearIcon fontSize="inherit" />
            </IconButton>
        </Box>
    )
}

export default DeleteButton
