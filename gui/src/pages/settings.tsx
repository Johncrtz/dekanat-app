import FlashlightOffIcon from "@mui/icons-material/FlashlightOff"
import FlashlightOnIcon from "@mui/icons-material/FlashlightOn"
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices"
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Switch,
    TextField,
    Tooltip,
    Typography,
    Divider,
    List,
} from "@mui/material"
import MetaTitle from "components/MetaTitle"
import ThemeSwitch from "components/ThemeSwitch"
import type { NextPage } from "next"
import { useThemeToggler } from "pages/_app"
import RememberMeIcon from "@mui/icons-material/RememberMe"
import { useState } from "react"
import TimelapseIcon from "@mui/icons-material/Timelapse"
import InfoIcon from "@mui/icons-material/Info"
import { useUser } from "auth"

const ListIconWithTooltip: React.FC<{
    children: React.ReactNode
    tooltip: string
}> = props => {
    const [hover, setHover] = useState<boolean>(false)

    return (
        <ListItemIcon
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {hover ? (
                <Tooltip title={props.tooltip} arrow>
                    <InfoIcon
                        sx={{
                            cursor: "pointer",
                        }}
                    />
                </Tooltip>
            ) : (
                props.children
            )}
        </ListItemIcon>
    )
}

type UserAccountSettings = {
    rememberMe: boolean
    sessionDuration: number
}

const Settings: NextPage = () => {
    const { getTheme } = useThemeToggler()
    const { user } = useUser()

    const [accountSettings, setAccountSettings] = useState<UserAccountSettings>(
        {
            rememberMe: true,
            sessionDuration: 14,
        }
    )

    const updateAccountSettings = <T extends keyof UserAccountSettings>(
        key: T,
        value: UserAccountSettings[T]
    ) => {
        setAccountSettings(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    return (
        <>
            <MetaTitle title="Einstellungen" />
            <Typography variant={"h4"}>Einstellungen</Typography>
            <Divider />

            {/* Theme */}

            <List
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    mt: 10,
                }}
                subheader={<ListSubheader>Theme</ListSubheader>}
            >
                <ListItem>
                    <ListItemIcon>
                        {getTheme() === "dark" ? (
                            <FlashlightOffIcon />
                        ) : (
                            <FlashlightOnIcon />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        id="setting-theme-mode"
                        primary="Dunkles Desgin"
                    />
                    <ThemeSwitch />
                </ListItem>
                {/* <ListItem>
                    <ListIconWithTooltip tooltip="Platzhalter">
                        <MiscellaneousServicesIcon />
                    </ListIconWithTooltip>
                    <ListItemText
                        id="setting-placeholder"
                        primary="Sonstiges"
                    />
                    <Switch />
                </ListItem> */}
            </List>

            {user?.isLoggedIn && (
                <List
                    sx={{
                        width: "100%",
                        maxWidth: 360,
                        mt: 5,
                    }}
                    subheader={<ListSubheader>Benutzerkonto</ListSubheader>}
                >
                    <ListItem>
                        <ListIconWithTooltip tooltip="Ihre Anmeldedaten werden gespeichert. Sie werden bei Ihrer nächsten Anmeldung automatisch eingeloggt.">
                            <RememberMeIcon />
                        </ListIconWithTooltip>
                        <ListItemText
                            id="setting-placeholder"
                            primary="Mein Benutzer-Konto merken"
                        />
                        <Switch
                            checked={accountSettings.rememberMe}
                            disabled
                            onChange={e =>
                                updateAccountSettings(
                                    "rememberMe",
                                    e.target.checked
                                )
                            }
                        />
                    </ListItem>
                    {accountSettings.rememberMe && (
                        <ListItem>
                            <ListIconWithTooltip tooltip="Geben Sie die Zeit an, für wie lange wir Ihre Anmeldedaten speichern sollen.">
                                <TimelapseIcon />
                            </ListIconWithTooltip>
                            <ListItemText
                                id="setting-placeholder"
                                primary="Session-Dauer"
                            />
                            <TextField
                                disabled
                                type="number"
                                value={accountSettings.sessionDuration}
                                onChange={e => {}}
                                sx={{
                                    width: "70px",
                                }}
                            />
                        </ListItem>
                    )}
                </List>
            )}
        </>
    )
}

export default Settings
