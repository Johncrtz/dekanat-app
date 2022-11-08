import {
    TableContainer,
    Paper,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    TableFooter,
    Typography,
    IconButton,
    Tooltip,
    Stack,
} from "@mui/material"
import Link from "components/Link"
import { VersionTag } from "types/VersionTag"
import InfoIcon from "@mui/icons-material/Info"
import SupportedIcon from "@mui/icons-material/CheckCircleRounded"
import UnsupportedIcon from "@mui/icons-material/Dangerous"
import InDevelopmentIcon from "@mui/icons-material/PrecisionManufacturing"
import InTestingIcon from "@mui/icons-material/Biotech"
const getIconTooltip = (support: Feature["support"]): string =>
    support === "supported"
        ? "Unterstützt"
        : support === "unsupported"
        ? "Nicht unterstützt"
        : support === "in-testing"
        ? "In Testphase"
        : "In Entwicklung"
const getIcon = (support: Feature["support"]): JSX.Element =>
    support === "supported" ? (
        <SupportedIcon fontSize="small" color="success" />
    ) : support === "unsupported" ? (
        <UnsupportedIcon fontSize="small" color="error" />
    ) : support === "in-testing" ? (
        <InTestingIcon fontSize="small" color="warning" />
    ) : (
        <InDevelopmentIcon fontSize="small" color="info" />
    )

export type Feature = {
    name: string
    infoText: string
    support: "supported" | "unsupported" | "in-development" | "in-testing"
    /**
     * since when this feature is supported or current release notes with important changes
     */
    release?: VersionTag
}

export type SupportedFeaturesProps = {
    features: Feature[]
}

export const SupportedFeatures: React.FC<SupportedFeaturesProps> = props => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Release-Notes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.features.map(feature => (
                        <TableRow key={feature.name}>
                            <TableCell>
                                <Stack
                                    direction="row"
                                    sx={{
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography>{feature.name}</Typography>
                                    {feature.infoText &&
                                        feature.infoText.length > 0 && (
                                            <Tooltip
                                                arrow
                                                placement="right"
                                                title={feature.infoText}
                                            >
                                                <IconButton size="small">
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    arrow
                                    placement="right"
                                    title={getIconTooltip(feature.support)}
                                >
                                    {getIcon(feature.support)}
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Link href={`/release/${feature.release}`}>
                                    {feature.release}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell>Übersicht über die Features</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default SupportedFeatures
