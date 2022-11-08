import {
    Box,
    Button,
    Chip,
    Stack,
    Typography,
    Paper,
    Container,
    useTheme,
} from "@mui/material"
import MetaTitle from "components/MetaTitle"
import Link from "components/Link"
import { VersionTag } from "types/VersionTag"
import { localeDateString } from "utils/date"

export type ReleaseProps = {
    version: VersionTag
    prerelease: boolean
    title: string
    date: Date
    teaser: React.ReactNode
    description: React.ReactNode
}

/**
 * // BUG:
 * https://nextjs.org/docs/messages/react-hydration-error
 */

export const Release: React.FC<ReleaseProps> = props => {
    const theme = useTheme()
    return (
        <>
            {/* <MetaTitle title={"Release Notes " + props.version} /> */}

            <Container
                component={Paper}
                sx={{
                    borderRadius: theme.shape.borderRadius,
                    p: theme.spacing(5),
                    maxWidth: "80%",
                    width: "700px",
                }}
            >
                <Stack direction="row">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            display: "flex",

                            flexGrow: 1,
                        }}
                    >
                        Release of » {props.title} «
                    </Typography>
                    <Typography
                        sx={{
                            fontStyle: "italic",
                        }}
                        variant="caption"
                    >
                        {localeDateString(props.date)}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Chip
                        label={props.version}
                        sx={{
                            fontSize: "70%",
                            fontFamily: "monospace",
                        }}
                        color="info"
                        size="small"
                    />
                    {props.prerelease && (
                        <Chip
                            label={"Prerelease"}
                            sx={{
                                fontSize: "70%",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                            }}
                            color="error"
                            size="small"
                        />
                    )}
                </Stack>

                <Box
                    sx={{
                        p: theme.spacing(2),
                        color: theme.palette.grey.A700,
                        fontSize: "80%",
                        my: theme.spacing(4),
                    }}
                >
                    {props.teaser}
                </Box>

                <Box>{props.description}</Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        flexDirection: "column",
                        mt: theme.spacing(7),
                    }}
                >
                    <Link
                        href="/service-desk"
                        muiLinkProps={{
                            sx: {
                                textDecoration: "none",
                            },
                        }}
                    >
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                        >
                            Report A Bug
                        </Button>
                    </Link>
                </Box>
            </Container>
        </>
    )
}
export default Release
