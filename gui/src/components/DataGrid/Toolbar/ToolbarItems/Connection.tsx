import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const useConnectionStatusColor = (status: ConnectionStatus) => {
    const theme = useTheme()
    switch (status) {
        case "connected":
            return theme.palette.success.light
        case "disconnected":
            return theme.palette.error.light
        case "connecting":
            return theme.palette.warning.light
        case "busy":
            return theme.palette.warning.light
        default:
            return theme.palette.text.secondary
    }
}

export type ConnectionStatus =
    | "connected"
    | "disconnected"
    | "connecting"
    | "busy"

type ConnectionProps = {
    status: ConnectionStatus
}
/**
 * Toolbar item for connection status.
 */
const Connection: React.FC<ConnectionProps> = props => (
    <Box
        sx={{
            display: "flex",
            padding: 2,
            alignItems: "center",
        }}
    >
        <FiberManualRecordIcon
            fontSize="small"
            sx={{
                mr: 1,
                color: useConnectionStatusColor(props.status),
            }}
        />
        <Typography
            variant="caption"
            sx={{
                fontStyle: "italic",
                color: "#666",
            }}
        >
            {props.status === "connected" ? "verbunden" : props.status}
        </Typography>
    </Box>
)

export default Connection
