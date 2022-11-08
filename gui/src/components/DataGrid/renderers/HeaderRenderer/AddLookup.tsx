import { ColumnInfo, ViewDescriptor } from "@intutable/lazy-views/dist/types"
import LookupIcon from "@mui/icons-material/ManageSearch"
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { fetcher } from "api/fetcher"
import { useSnacki } from "hooks/useSnacki"
import { useTable } from "hooks/useTable"
import { useView } from "hooks/useView"
import React, { useEffect, useMemo, useState } from "react"
import { HeaderRendererProps } from "react-data-grid"
import { Row } from "types"
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
} from "@mui/material"

import { useLink } from "hooks/useLink"
import { TableColumn } from "types"
import { ColumnUtility } from "utils/ColumnUtility"

type ModalProps = {
    open: boolean
    onClose: () => void
    onAddLookupModal: (column: ColumnInfo) => unknown
    foreignTable: ViewDescriptor
}

const Modal: React.FC<ModalProps> = props => {
    const theme = useTheme()
    const { snackError } = useSnacki()

    const {
        linkTableData: data,
        error,
        getColumn,
    } = useLink({ table: props.foreignTable })

    const [selection, setSelection] = useState<TableColumn | null>(null)
    const selectedColDescriptor = useMemo(
        () => (selection && data ? getColumn(selection) : null),
        [data, selection, getColumn]
    )

    useEffect(() => {
        if (error) {
            snackError("Die Tabelle konnte nicht geladen werden")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    const onClickHandler = (column: TableColumn) => {
        setSelection(column)
    }

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <DialogTitle>
                Spalte aus verlinkter Tabelle <i>{props.foreignTable.name}</i>{" "}
                als Lookup hinzufügen
            </DialogTitle>
            <DialogContent>
                {data == null && error == null ? (
                    <CircularProgress />
                ) : error ? (
                    <>Error: {error}</>
                ) : (
                    <>
                        <List>
                            {data!.columns
                                .filter(c => !ColumnUtility.isAppColumn(c))
                                .map((col, i) => (
                                    <ListItem
                                        key={i}
                                        disablePadding
                                        sx={{
                                            bgcolor:
                                                selection?.key === col.key
                                                    ? theme.palette.action
                                                          .selected
                                                    : undefined,
                                        }}
                                    >
                                        <ListItemButton
                                            onClick={onClickHandler.bind(
                                                null,
                                                col
                                            )}
                                        >
                                            <ListItemText primary={col.name} />
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
                    loading={data == null && error == null}
                    loadingIndicator="Lädt..."
                    onClick={async () => {
                        await props.onAddLookupModal(selectedColDescriptor!)
                        props.onClose()
                    }}
                    disabled={selectedColDescriptor == null || error}
                >
                    Hinzufügen
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export type AddLookupProps = {
    headerRendererProps: HeaderRendererProps<Row>
    colInfo: ColumnInfo
    foreignTable: ViewDescriptor | null | undefined
    onCloseContextMenu: () => void
}

export const AddLookup: React.FC<AddLookupProps> = props => {
    const { headerRendererProps, colInfo: col, foreignTable } = props
    const { snackError } = useSnacki()

    const kind = headerRendererProps.column._kind!
    const { data, mutate: mutateTable } = useTable()
    const { mutate: mutateView } = useView()

    const [anchorEL, setAnchorEL] = useState<Element | null>(null)

    const openModal = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        setAnchorEL(e.currentTarget)
    }
    const closeModal = () => setAnchorEL(null)

    const handleAddLookup = async (column: ColumnInfo) => {
        if (kind !== "link") return
        try {
            const joinId = col!.joinId!
            await fetcher({
                url: `/api/lookupField/${column.id}`,
                body: {
                    tableId: data!.metadata.descriptor.id,
                    joinId,
                },
            })
            await mutateTable()
            await mutateView()
            props.onCloseContextMenu()
        } catch (error) {
            snackError("Der Lookup konnte nicht hinzugefügt werden!")
        }
    }

    if (kind !== "link") return null
    if (foreignTable == null) return null

    return (
        <>
            <MenuItem onClick={openModal}>
                <ListItemIcon>
                    <LookupIcon />
                </ListItemIcon>
                <ListItemText>Lookup hinzufügen</ListItemText>
            </MenuItem>

            <Modal
                open={anchorEL != null}
                onClose={closeModal}
                onAddLookupModal={handleAddLookup}
                foreignTable={foreignTable}
            />
        </>
    )
}
