import { ViewDescriptor } from "@intutable/lazy-views/dist/types"
import AddBoxIcon from "@mui/icons-material/AddBox"
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    List,
    TextField,
    Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useAPI } from "context/APIContext"
import { useSnacki } from "hooks/useSnacki"
import { useTable } from "hooks/useTable"
import { useViews } from "hooks/useViews"
import React, { useState } from "react"
import { makeError } from "utils/error-handling/utils/makeError"
import { ViewListItem } from "./ViewListItem"

type AddViewModalProps = {
    open: boolean
    onClose: () => void
    onHandleCreateView: (name: string) => Promise<void>
}

const AddViewModal: React.FC<AddViewModalProps> = props => {
    const [name, setName] = useState<string>("")

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <DialogTitle>Neue Sicht erstellen</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    {/* Name */}
                    <TextField
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose()}>Abbrechen</Button>
                <Button
                    onClick={async () => {
                        await props.onHandleCreateView(name)
                        props.onClose()
                    }}
                    disabled={name === ""}
                >
                    Erstellen
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export type ViewNavigatorProps = {
    open: boolean
}
export const ViewNavigator: React.FC<ViewNavigatorProps> = props => {
    const theme = useTheme()

    const { view: currentView, setView } = useAPI()
    const { data } = useTable()
    const { views, createView, renameView, deleteView, mutate } = useViews({
        table: data?.metadata.descriptor,
    })
    const { snackInfo, snackError } = useSnacki()

    // anchor for "create view" modal
    const [anchorEL, setAnchorEL] = useState<Element | null>(null)

    if (props.open === false) return null

    const handleCreateView = async (name: string): Promise<void> => {
        try {
            const newView = await createView(name)
            setView(newView)
        } catch (error) {
            const err = makeError(error)
            if (err.message === "alreadyTaken")
                snackError("Dieser Name wird bereits für eine Sicht verwendet!")
            else snackError("unbekannter Fehler beim erstellen der Sicht")
        }
    }
    const handleSelectView = async (view: ViewDescriptor): Promise<void> => {
        if (currentView?.id === view.id) return
        else setView(view)
    }

    const handleRenameView = async (
        view: ViewDescriptor,
        newName: string
    ): Promise<void> => {
        try {
            await renameView(view.id, newName)
        } catch (error) {
            const err = makeError(error)
            if (err.message === "alreadyTaken")
                snackError("Dieser Name wird bereits für eine Sicht verwendet!")
            else if (err.message === "changeDefaultView")
                snackInfo("Standardsicht kann nicht umbenannt werden.")
            else snackError("Sicht konnte nicht umbenannt werden!")
        }
    }

    const handleDeleteView = async (view: ViewDescriptor): Promise<void> => {
        if (views == null) return
        if (views.length === 1) {
            snackInfo("Kann einzige Sicht nicht löschen")
            return
        }
        try {
            await deleteView(view.id)
            mutate()
        } catch (error) {
            const err = makeError(error)
            if (err.message === "changeDefaultView")
                snackInfo("Standardsicht kann nicht gelöscht werden..")
            else snackError("Sicht konnte nicht gelöscht werden")
        }
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                border: "1px solid",
                borderColor: theme.palette.divider,
                borderRadius: "4px",
                overflow: "hidden",
                p: theme.spacing(1),
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography
                variant="overline"
                sx={{
                    letterSpacing: 1,
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    width: "100%",
                    textAlign: "center",
                }}
            >
                Views
            </Typography>
            <Divider />
            <List
                sx={{
                    overflowY: "scroll",
                    flex: 1,
                }}
            >
                {views &&
                    views.map(view => (
                        <ViewListItem
                            key={view.id}
                            view={view}
                            onHandleSelectView={handleSelectView}
                            onHandleRenameView={handleRenameView}
                            onHandleDeleteView={handleDeleteView}
                        />
                    ))}
            </List>
            <IconButton
                size="medium"
                onClick={e => setAnchorEL(e.currentTarget)}
                sx={{
                    width: "100%",
                    borderRadius: "4px",
                }}
            >
                <AddBoxIcon />
            </IconButton>
            <AddViewModal
                open={anchorEL != null}
                onClose={() => setAnchorEL(null)}
                onHandleCreateView={handleCreateView}
            />
        </Box>
    )
}
