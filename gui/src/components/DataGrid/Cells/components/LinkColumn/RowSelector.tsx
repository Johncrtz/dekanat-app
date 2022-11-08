import { JoinDescriptor, ViewDescriptor } from "@intutable/lazy-views"
import LoadingButton from "@mui/lab/LoadingButton"
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { fetcher } from "api"
import { RowPreview, useLink } from "hooks/useLink"
import { useTable } from "hooks/useTable"
import { useView } from "hooks/useView"
import { useSnackbar } from "notistack"
import React, { useState } from "react"

export type RowSelectorProps = {
    rowId: number
    join: JoinDescriptor
    foreignTable: ViewDescriptor
    open: boolean
    onClose: () => void
}

export const RowSelector: React.FC<RowSelectorProps> = props => {
    const theme = useTheme()
    const { enqueueSnackbar } = useSnackbar()

    const { data: baseTableData, mutate: mutateTable } = useTable()
    const { mutate: mutateView } = useView()
    const { error, rowPreviews } = useLink({ table: props.foreignTable })

    const [selection, setSelection] = useState<RowPreview | null>(null)

    const handlePickRow = async () => {
        try {
            await fetcher({
                url: `/api/join/${props.join.id}`,
                body: {
                    tableId: baseTableData!.metadata.descriptor.id,
                    rowId: props.rowId,
                    value: selection?.id,
                },
            })
            await mutateTable()
            await mutateView()
        } catch (err) {
            enqueueSnackbar("Die Zeile konnte nicht hinzugefügt werden!", {
                variant: "error",
            })
        } finally {
            props.onClose()
        }
    }

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <DialogTitle>Wähle eine Zeile</DialogTitle>
            <DialogContent>
                {rowPreviews == null && error == null ? (
                    <CircularProgress />
                ) : error ? (
                    <>Error: {error}</>
                ) : (
                    <>
                        <List>
                            {rowPreviews!
                                .filter(row => row.text != null)
                                .map(row => (
                                    <ListItem
                                        key={row.id}
                                        disablePadding
                                        sx={{
                                            bgcolor:
                                                selection?.id === row.id
                                                    ? theme.palette.action
                                                          .selected
                                                    : undefined,
                                        }}
                                    >
                                        <ListItemButton
                                            onClick={() => setSelection(row)}
                                        >
                                            <ListItemText primary={row.text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => props.onClose()}>Abbrechen</Button>
                <LoadingButton
                    loading={rowPreviews == null && error == null}
                    loadingIndicator="Lädt..."
                    onClick={handlePickRow}
                    disabled={selection == null || error}
                >
                    Hinzufügen
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default RowSelector
