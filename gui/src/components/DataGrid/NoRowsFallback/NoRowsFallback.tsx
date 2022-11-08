import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import WarningIcon from "@mui/icons-material/Warning"

const NoRowsFallback = () => {
    const theme = useTheme()
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            <WarningIcon
                sx={{
                    color: theme.palette.warning.main,
                    fontSize: theme.spacing(7),
                    mb: theme.spacing(2),
                }}
            />
            <Typography sx={{ color: theme.palette.text.secondary }}>
                Diese Tabelle hat noch keinen Inhalt.
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
                Füge Spalten und Zeilen hinzu!
            </Typography>
        </Box>
    )
}

export default NoRowsFallback
