import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    ListItemText,
    MenuItem,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useView } from "hooks/useView"
import React, { useMemo, useState } from "react"
import { HeaderRendererProps } from "react-data-grid"
import { Column, Row } from "types"
import InfoIcon from "@mui/icons-material/Info"
import { ChangeCellType } from "./ChangeCellType"

type AttributeProps = {
    label: string
    helperText?: string
    value: React.ReactNode
}

const Attribute: React.FC<AttributeProps> = props => {
    const theme = useTheme()
    const { label, value } = props

    return (
        <>
            <Stack
                sx={{
                    my: 2,
                }}
            >
                <Typography variant="body1">{value}</Typography>
                <Typography
                    variant="caption"
                    sx={{
                        mt: -0.3,
                        fontStyle: "italic",
                        color: theme.palette.grey[700],
                        fontSize: "60%",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {label}
                    {props.helperText && (
                        <Tooltip
                            arrow
                            title={props.helperText}
                            placement="right"
                        >
                            <InfoIcon
                                sx={{
                                    ml: 0.4,
                                    fontSize: 10,
                                }}
                            />
                        </Tooltip>
                    )}
                </Typography>
            </Stack>
            <Divider />
        </>
    )
}

type ModalProps = {
    open: boolean
    onClose: () => void
    headerRendererProps: HeaderRendererProps<Row>
}

const Modal: React.FC<ModalProps> = props => {
    const { open, onClose, headerRendererProps } = props

    const { data: view } = useView()
    const column = useMemo(
        () =>
            view
                ? (view.columns.find(
                      c => c._id! === headerRendererProps.column._id
                  ) as unknown as Column)
                : null,
        [headerRendererProps.column._id, view]
    )

    if (column == null) return null

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Eigenschaften</DialogTitle>
            <DialogContent>
                <Attribute label={"Name"} value={column.name as string} />
                <Attribute
                    label="Spalten-Typ"
                    helperText="'Standard', 'Link', 'Lookup' und 'Index' sind die übergeordneten Spaltentypen."
                    value={column._kind as string}
                />
                <Attribute
                    label="Zellen-Typ"
                    helperText="Typ des Inhalts der Zellen einer Spalte, bspw. 'Text' oder 'Datum'."
                    value={<ChangeCellType onClose={onClose} column={column} />}
                />
                <Attribute
                    label={"Editierbar"}
                    value={column.editable ? "Ja" : "Nein"}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Schließen</Button>
            </DialogActions>
        </Dialog>
    )
}

export type ColumnAttributesWindowProps = {
    headerRendererProps: HeaderRendererProps<Row>
    onCloseContextMenu: () => void
}

export const ColumnAttributesWindow: React.FC<
    ColumnAttributesWindowProps
> = props => {
    const [anchorEL, setAnchorEL] = useState<Element | null>(null)
    const openModal = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        setAnchorEL(e.currentTarget)
    }
    const closeModal = () => {
        setAnchorEL(null)
        props.onCloseContextMenu()
    }

    return (
        <>
            <MenuItem onClick={openModal}>
                <ListItemText>Eigenschaften</ListItemText>
            </MenuItem>

            <Modal
                open={anchorEL != null}
                onClose={closeModal}
                headerRendererProps={props.headerRendererProps}
            />
        </>
    )
}
