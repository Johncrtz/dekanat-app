import { Box, Divider, Tooltip, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import MetaTitle from "components/MetaTitle"
import { ReleaseList } from "components/Release Notes/ReleaseList"
import type { NextPage } from "next"
import { supportedFeatures } from "public/supportedFeatures"
import SupportedFeatures from "components/Wiki/SupportedFeatures"
import Link from "components/Link"

const ServiceDesk: NextPage = () => {
    const theme = useTheme()
    return (
        <>
            <MetaTitle title="Service Desk" />
            <Typography variant={"h4"}>Service Desk</Typography>
            <Divider />

            {/* Bugs & Feature-Requests */}
            <Typography variant={"h5"} sx={{ mt: 20 }}>
                Bugs und Feature-Requests
            </Typography>
            <Divider />
            <ul>
                <li>
                    <Typography>
                        Bugs oder Feature-Requests können mit einer
                        <Tooltip
                            title="Die Beschreibung sollte Angaben wie die Seite, auf der es zu einem Fehler kam, beinhalten, welche Aktionen im Detail ausgeführt wurden etc."
                            arrow
                        >
                            <Box
                                sx={{
                                    textDecoration: "dotted",
                                }}
                            >
                                detaillierten
                            </Box>
                        </Tooltip>{" "}
                        Beschreibung an diese{" "}
                        <a href="mailto:contact-project+intutable-dekanat-app-30881788-issue-@incoming.gitlab.com">
                            E-Mail
                        </a>{" "}
                        gesendet werden. Die Entwickler erhalten eine Nachricht
                        und werden das Problem so schnell wie möglich lösen.
                    </Typography>
                </li>
            </ul>

            {/* Caveats */}
            <Typography variant={"h5"} sx={{ mt: 20 }}>
                Caveats
            </Typography>
            <Divider />
            <ul>
                <li>
                    <Typography
                        sx={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        Einige Browser (u.a. Safari) werden zzt. nicht
                        vollständig unterstützt. Wir empfehlen Google Chrome.
                    </Typography>
                </li>
                <li>
                    <Typography
                        sx={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        Die App ist zzt. nicht für mobile Endgeräte optimiert.
                    </Typography>
                </li>
                <li>
                    <Typography
                        sx={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        Einige Kontext-Menüs können nicht zuverlässig mit der
                        Maus bedient werden. Dann kann trotzdem die Tastatur zum
                        Navigieren verwendet werden.
                    </Typography>
                </li>
            </ul>

            {/* Wiki */}
            {/* <Typography variant={"h5"} sx={{ mt: 20 }}>
                Wiki
            </Typography>
            <Divider />
            <ul>
                <li>
                    <Typography
                        sx={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        Wirf einen Blick in&apos;s{" "}
                        <Link href="/wiki/">Wiki</Link> .
                    </Typography>
                </li>
            </ul> */}

            {/* Features */}
            <Typography variant={"h5"} sx={{ mt: 20 }}>
                Features
            </Typography>
            <SupportedFeatures features={supportedFeatures} />

            {/* Versionsverlauf */}
            <Typography variant={"h5"} sx={{ mt: 20 }}>
                Versionsverlauf
            </Typography>
            <Divider />

            <ReleaseList />
        </>
    )
}

export default ServiceDesk
