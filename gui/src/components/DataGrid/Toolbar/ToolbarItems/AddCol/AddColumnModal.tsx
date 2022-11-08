import { StandardColumnSpecifier } from "@backend/types"
import Cells from "@datagrid/Cells"
import HelpIcon from "@mui/icons-material/Help"
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import React, { useEffect, useState } from "react"

type AddColumnModalProps = {
    open: boolean
    onClose: () => void
    onHandleCreateColumn: (column: StandardColumnSpecifier) => Promise<void>
    
}

export const AddColumnModal: React.FC<AddColumnModalProps> = props => {
    const theme = useTheme()
    console.log("addColumnModal");
    const [moreOptionsActive, setMoreOptionsActive] = useState(false)
    const [options, setOptions] = useState<StandardColumnSpecifier>({
        name: "",
        _cellContentType: "string",
        editable: true,
    })
    const [valid, setValid] = useState(false)

    useEffect(() => {
        if (options.name.length > 0) setValid(true)
    }, [options.name])

    const setOption = <T extends keyof StandardColumnSpecifier>(
        option: T,
        value: StandardColumnSpecifier[T]
    ) => {
        setOptions(prev => ({
            ...prev,
            [option]: value,
        }))
    }

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <DialogTitle>Neue Spalte erstellen</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    {/* Name */}
                    <TextField
                        label="Name"
                        variant="outlined"
                        value={options.name}
                        onChange={e => setOption("name", e.target.value)}
                    />

                    {/* Type */}
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="addcol-select-type">Typ</InputLabel>
                            <Select
                                labelId="addcol-select-type"
                                label="Typ"
                                value={options._cellContentType}
                                onChange={e => {
                                    setOption(
                                        "_cellContentType",
                                        e.target.value
                                    )
                                }}
                            >
                                {Cells.map(cell => (
                                    <MenuItem
                                        key={cell.brand}
                                        value={cell.brand}
                                    >
                                        {cell.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Tooltip
                            title="Typ der Zellen einer Spalte"
                            arrow
                            enterDelay={1000}
                            placement="right"
                        >
                            <IconButton
                                size="small"
                                sx={{
                                    mt: 2,
                                    ml: 0.5,
                                }}
                            >
                                <HelpIcon
                                    sx={{
                                        cursor: "pointer",
                                        fontSize: "85%",
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    {moreOptionsActive && (
                        // Editable
                        <Box sx={{ mt: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={options.editable ?? true}
                                        onChange={e =>
                                            setOption(
                                                "editable",
                                                e.target.checked
                                            )
                                        }
                                    />
                                }
                                label="Editierbar"
                            />
                        </Box>
                        // Frozen
                        // Resizable
                        // sortable
                    )}
                </FormControl>
                <Typography
                    sx={{
                        fontStyle: "italic",
                        color: theme.palette.text.disabled,
                        fontSize: theme.typography.caption,
                        fontWeight: theme.typography.fontWeightLight,
                        cursor: "pointer",
                        textAlign: "right",
                        mt: 2,
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                    onClick={() => setMoreOptionsActive(prev => !prev)}
                >
                    {moreOptionsActive ? "Weniger" : "Erweiterte"} Einstellungen
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose()}>Abbrechen</Button>
                <Button
                    onClick={async () => {
                        await props.onHandleCreateColumn(options)
                        props.onClose()
                    }}
                    disabled={valid == false}
                >
                    Erstellen
                </Button>
            </DialogActions>
        </Dialog>
    )
}
