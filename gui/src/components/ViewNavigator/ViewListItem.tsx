import { ViewDescriptor } from "@intutable/lazy-views/dist/types"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ClearIcon from "@mui/icons-material/Clear"
import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useAPI } from "context/APIContext"
import React, { useState } from "react"

export type ViewListItemProps = {
    view: ViewDescriptor
    key: number
    /**
     * only when `children` is not a string
     */
    title?: string
    /**
     * default {@link ChevronRightIcon}
     */
    icon?: React.ReactNode
    onHandleSelectView: (view: ViewDescriptor) => Promise<void>
    onHandleRenameView: (view: ViewDescriptor, newName: string) => Promise<void>
    onHandleDeleteView: (view: ViewDescriptor) => Promise<void>
}

export const ViewListItem: React.FC<ViewListItemProps> = props => {
    const view: ViewDescriptor = props.view

    const { view: currentView } = useAPI()
    const theme = useTheme()

    const [hovering, setHovering] = useState<boolean>(false)

    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    const handleOpenContextMenu = (event: React.MouseEvent<HTMLLIElement>) => {
        event.preventDefault()
        setAnchorEl(event.currentTarget.children[0] as HTMLDivElement)
    }
    const handleCloseContextMenu = () => setAnchorEl(null)

    const handleRenameView = async () => {
        handleCloseContextMenu()
        const newName = prompt("Neuer Name:")
        if (!newName) return
        return props.onHandleRenameView(view, newName)
    }

    const handleDeleteViewButton = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation()
        const confirmed = confirm("Sicht wirklich löschen?")
        if (confirmed) return props.onHandleDeleteView(view)
    }

    return (
        <>
            <ListItem
                sx={{
                    p: 0,
                    mb: 0.5,
                    bgcolor:
                        view.id === currentView?.id
                            ? theme.palette.grey[100]
                            : undefined,
                }}
                dense
                disablePadding
                onContextMenu={handleOpenContextMenu}
                onMouseOver={() => setHovering(true)}
                onMouseOut={() => setHovering(false)}
            >
                <Typography
                    variant="subtitle2"
                    onClick={() => {}}
                    sx={{
                        cursor: "pointer",
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    <ListItemButton
                        onClick={() => props.onHandleSelectView(view)}
                    >
                        {props.icon || <ChevronRightIcon />}
                        <ListItemText sx={{ ml: 1 }} primary={view.name} />
                        {hovering && (
                            <IconButton
                                size="small"
                                onClick={handleDeleteViewButton}
                            >
                                <ClearIcon
                                    sx={{
                                        fontSize: "80%",
                                    }}
                                />
                            </IconButton>
                        )}
                    </ListItemButton>
                </Typography>
            </ListItem>
            <Menu
                elevation={0}
                open={anchorEl != null}
                anchorEl={anchorEl}
                onClose={handleCloseContextMenu}
                PaperProps={{
                    sx: {
                        boxShadow: theme.shadows[1],
                    },
                }}
            >
                <MenuItem onClick={handleRenameView}>Umbenennen</MenuItem>
            </Menu>
        </>
    )
}
