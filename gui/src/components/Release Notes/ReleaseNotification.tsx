import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Link from "components/Link"
import { releases } from "public/releases"
import { ReleaseProps } from "./Release"
const byDate = (a: ReleaseProps, b: ReleaseProps) =>
    b.date.getTime() - a.date.getTime()
const getLatestRelease = (releases: ReleaseProps[]) => releases.sort(byDate)[0]

export const ReleaseNotification: React.FC = () => {
    const latestRelease = getLatestRelease(releases)
    const theme = useTheme()

    if (releases.length === 0) return null

    return (
        <Box
            sx={{
                borderRadius: theme.shape.borderRadius,
                p: theme.spacing(3),
                bgcolor: theme.palette.grey[100],
                display: "inline-block",
            }}
        >
            <Typography
                sx={{
                    mb: theme.spacing(2),
                }}
            >
                Eine neue Version ist verfügbar!
            </Typography>
            <Typography>
                Schau dir die Release-Notes{" "}
                <Link href={`/release/${latestRelease.version}`}>hier</Link> an.
            </Typography>

            <Typography>
                {latestRelease.title} wurde am{" "}
                {latestRelease.date.toLocaleDateString()} veröffentlicht
            </Typography>
        </Box>
    )
}
