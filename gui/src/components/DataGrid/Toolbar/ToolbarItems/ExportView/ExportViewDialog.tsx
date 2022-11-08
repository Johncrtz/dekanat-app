import { LoadingButton } from "@mui/lab"
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Switch,
    Typography,
} from "@mui/material"
import { useSelectedRows } from "context/SelectedRowsContext"
import { useSnacki } from "hooks/useSnacki"
import { useView } from "hooks/useView"
import React, { useMemo, useState } from "react"
import { ColumnUtility } from "utils/ColumnUtility"
import { ExportJob } from "utils/Export/ExportJob"
import { ExportOptions, ExportRequest } from "utils/Export/ExportRequest"

type ExportViewDialogProps = {
    open: boolean
    onClose: () => void
    allRowsSelected: boolean
    options?: {
        title?: string
        initialState?: ExportRequest
    }
}

const initialState: ExportRequest = {
    date: new Date(),
    options: {
        columnSelection: [],
    },
    file: {
        name: "",
        format: "csv",
        excludeDateString: true,
    },
}

export const ExportViewDialog: React.FC<ExportViewDialogProps> = props => {
    const { snackError } = useSnacki()
    const { data: viewData } = useView()
    const { selectedRows } = useSelectedRows() // TODO: consider row selection

    const [file, setFile] = useState<ExportRequest["file"]>(
        props.options?.initialState?.file || initialState.file
    )
    const [options, setOptions] = useState<ExportOptions>(
        props.options?.initialState?.options || initialState.options
    )
    const [considerRowSelection, setConsiderRowSelection] =
        useState<boolean>(false)
    const resetState = () => {
        setFile(props.options?.initialState?.file || initialState.file)
        setOptions(props.options?.initialState?.options || initialState.options)
    }

    // minimum user action: filename and column selection
    const valid = useMemo(
        () => file.name.length > 0 && options.columnSelection.length > 0,
        [file.name.length, options.columnSelection.length]
    )

    const [loading, setLoading] = useState<boolean>(false)
    const [fileBuffer, setFileBuffer] = useState<string | null>(null) // not actually a buffer
    const filename = file.name + "." + file.format

    const exportView = async () => {
        if (viewData == null) return
        setLoading(true)
        try {
            const job = new ExportJob(viewData.descriptor, {
                date: props.options?.initialState?.date || initialState.date,
                file,
                options: {
                    rowSelection: considerRowSelection
                        ? Array.from(selectedRows)
                        : undefined,
                    ...options,
                },
            })
            const _file = await job.request()

            setFileBuffer(_file)
        } catch (error) {
            snackError("Export fehlgeschlagen.")
            props.onClose()
        } finally {
            setLoading(false)
        }
    }

    // util
    const updateState = <
        U extends "file" | "options",
        T extends keyof ExportRequest[U]
    >(
        state: U,
        key: T,
        value: ExportRequest[U][T]
    ) =>
        state === "file"
            ? setFile(prev => ({ ...prev, [key]: value }))
            : setOptions(prev => ({ ...prev, [key]: value }))

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>
                {props.options?.title ||
                    `View ${viewData?.descriptor.name} exportieren`}
            </DialogTitle>
            <DialogContent>
                {options.columnSelection.length > 0 && (
                    <DialogContentText
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Typography
                            onClick={resetState}
                            variant="caption"
                            sx={{
                                cursor: "pointer",
                                fontStyle: "italic",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            zurücksetzen
                        </Typography>
                    </DialogContentText>
                )}
                <FormControl
                    fullWidth
                    sx={{
                        mt: 3,
                    }}
                >
                    <FormControl variant="outlined" sx={{ mb: 3 }}>
                        <InputLabel htmlFor="fileName-label">
                            Dateiname
                        </InputLabel>
                        <OutlinedInput
                            type="text"
                            id="fileName-label"
                            endAdornment={
                                <InputAdornment position="end">
                                    .csv
                                </InputAdornment>
                            }
                            label="Dateiname"
                            required
                            value={file.name}
                            onChange={e =>
                                updateState("file", "name", e.target.value)
                            }
                        />
                    </FormControl>

                    <FormControl sx={{ mb: 3 }}>
                        <InputLabel id="format-label">Format</InputLabel>
                        <Select
                            required
                            labelId="format-label"
                            value={file.format}
                            onChange={e =>
                                updateState(
                                    "file",
                                    "format",
                                    e.target
                                        .value as ExportRequest["file"]["format"]
                                )
                            }
                            input={<OutlinedInput label="Format" />}
                        >
                            <MenuItem value="json" disabled>
                                JSON
                            </MenuItem>
                            <MenuItem value="csv">CSV</MenuItem>
                            <MenuItem value="xlsx" disabled>
                                Excel
                            </MenuItem>
                            <MenuItem value="xml" disabled>
                                XML
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ mb: 3 }}>
                        <InputLabel id="columns-label">Spalten</InputLabel>
                        <Select
                            required
                            labelId="columns-label"
                            value={options.columnSelection}
                            multiple
                            multiline
                            onChange={e =>
                                updateState(
                                    "options",
                                    "columnSelection",
                                    e.target
                                        .value as ExportOptions["columnSelection"]
                                )
                            }
                            input={<OutlinedInput label="Format" />}
                        >
                            {viewData?.columns
                                .filter(
                                    col =>
                                        ColumnUtility.isAppColumn(col) === false
                                )
                                .map((col, i) => (
                                    <MenuItem key={i} value={col._id}>
                                        {col.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={options.includeHeader ?? false}
                                onChange={e =>
                                    updateState(
                                        "options",
                                        "includeHeader",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="Spalten-Titel mit exportieren"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={options.includeEmptyRows ?? false}
                                onChange={e =>
                                    updateState(
                                        "options",
                                        "includeEmptyRows",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="Leere Zeilen mit exportieren"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={
                                    selectedRows.size === 0
                                        ? false
                                        : considerRowSelection
                                }
                                onChange={e =>
                                    setConsiderRowSelection(e.target.checked)
                                }
                                disabled={selectedRows.size === 0}
                            />
                        }
                        label="Nur markierte Zeilen exportieren"
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose()}>Abbrechen</Button>
                <LoadingButton
                    loading={loading}
                    loadingIndicator={
                        <Stack direction="row">
                            <Typography variant="caption" sx={{ mr: 2 }}>
                                Exportiere
                            </Typography>
                            <CircularProgress size="1rem" sx={{ mr: 2 }} />
                        </Stack>
                    }
                    onClick={exportView}
                    disabled={valid === false}
                >
                    Exportieren
                </LoadingButton>
                {fileBuffer && (
                    <a
                        ref={ref => {
                            ref?.click()
                            setFileBuffer(null)
                            props.onClose()
                        }}
                        download={filename}
                        href={fileBuffer}
                        title={filename}
                    ></a>
                )}
            </DialogActions>
        </Dialog>
    )
}
