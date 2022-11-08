import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import OpenInNewOffIcon from "@mui/icons-material/OpenInNewOff"
import { IconButton, Tooltip } from "@mui/material"
import React from "react"

export type ToggleDetailViewProps = {
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
    open: boolean
}

export const ToggleDetailView: React.FC<ToggleDetailViewProps> = props => (
    <Tooltip
        arrow
        title={`Detaillierte Zeilen-Ansicht ${
            props.open ? "schließen" : "öffnen"
        }`}
        enterDelay={1000}
    >
        <IconButton onClick={props.handleClick} color="primary">
            {props.open ? <OpenInNewIcon /> : <OpenInNewOffIcon />}
        </IconButton>
    </Tooltip>
)
