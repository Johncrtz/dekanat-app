import OpenInFullIcon from "@mui/icons-material/OpenInFull"
import {
    Box,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useSnacki } from "hooks/useSnacki"
import { useView } from "hooks/useView"
import React, { useMemo } from "react"
import { CalculatedColumn } from "react-data-grid"
import { Row } from "types"

export type DetailedRowViewProps = {
    open: boolean
    data?: { row: Row; column: CalculatedColumn<Row> }
}
export const DetailedRowView: React.FC<DetailedRowViewProps> = props => {
    const theme = useTheme()
    const { snackWarning } = useSnacki()
    const { data } = useView()

    const row = useMemo(() => {
        if (props.data == null || data == null) return null
        const _row: { [key: string]: unknown } = {}
        Object.entries(props.data.row).forEach(([key, value]) => {
            const col = data.columns.find(col => col.key === key)!
            if (col == null) return
            _row[col.name as string] = value
        })
        return _row
    }, [data, props.data])

    if (props.open === false) return null

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                border: "1px solid",
                borderColor: theme.palette.divider,
                borderRadius: "4px",
                overflowX: "hidden",
                overflowY: "scroll",
                p: theme.spacing(1),
                maxHeight: "100%",
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
                Detail-Ansicht{" "}
                {props.data ? `Zeile ${props.data.row.__rowIndex__}` : ""}
            </Typography>
            <Divider />
            {props.data == null && (
                <Typography variant="caption">
                    Keine Zeile ausgewählt
                </Typography>
            )}
            {row && (
                <Stack
                    sx={{
                        overflow: "scroll",
                        pl: 1,
                        pt: 1,
                    }}
                >
                    {Object.entries(row).map(([key, value], i) => (
                        // TODO: sort based on columns
                        <Stack key={i}>
                            <Typography variant="body1" sx={{ mt: 1.5 }}>
                                {value as string}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: -0.5,
                                    fontStyle: "italic",
                                    color: theme.palette.grey[700],
                                    fontSize: "60%",
                                }}
                            >
                                {key}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            )}
            {props.data && (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 5,
                        }}
                    >
                        <Tooltip
                            title="Ansicht maximieren"
                            enterDelay={1000}
                            arrow
                        >
                            <IconButton
                                size="small"
                                onClick={() =>
                                    snackWarning("Nicht unterstützt")
                                }
                            >
                                <OpenInFullIcon
                                    sx={{
                                        fontSize: "70%",
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Divider sx={{ my: 0.5 }} />
                    <Typography
                        sx={{
                            p: 1,
                            fontSize: "70%",
                            color: theme.palette.error.light,
                        }}
                    >
                        Dieses Feature wird zzt. nicht vollständig unterstützt.
                    </Typography>
                </>
            )}
        </Box>
    )
}

export default DetailedRowView
