import LoginIcon from "@mui/icons-material/Login"
import PersonIcon from "@mui/icons-material/Person"
import {
    Avatar as MUIAvatar,
    Button,
    Menu,
    MenuItem,
    Stack,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { fetcher } from "api"
import { useUser } from "auth/useUser"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import React, { useState } from "react"
import { User } from "types/User"

type ContextMenuProps = {
    anchorEL: Element
    open: boolean
    onClose: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = props => {
    const theme = useTheme()
    const router = useRouter()
    const { mutateUser } = useUser()
    const { enqueueSnackbar } = useSnackbar()

    const handleLogout = async () => {
        try {
            props.onClose()
            await mutateUser(fetcher<User>({ url: "/api/auth/logout" }))
            router.push("/login")
        } catch (error) {
            enqueueSnackbar("Fehler beim Abmeldevorgang!", { variant: "error" })
        }
    }

    return (
        <Menu
            elevation={0}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={props.open}
            anchorEl={props.anchorEL}
            onClose={props.onClose}
            PaperProps={{
                sx: {
                    boxShadow: theme.shadows[1],
                },
            }}
        >
            <MenuItem
                onClick={() => {
                    props.onClose()
                    router.push("/settings")
                }}
            >
                Einstellungen
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                Abmelden <LoginIcon sx={{ ml: 1 }} />
            </MenuItem>
        </Menu>
    )
}

export const Avatar: React.FC = () => {
    const { user } = useUser()
    const router = useRouter()

    const [anchorEL, setAnchorEL] = useState<HTMLElement | null>(null)
    const handleToggleContextMenu = (event: {
        preventDefault: () => void
        currentTarget: React.SetStateAction<HTMLElement | null>
    }) => {
        event.preventDefault()
        setAnchorEL(event.currentTarget)
    }
    const handleCloseContextMenu = () => setAnchorEL(null)

    if (!user || user?.isLoggedIn === false)
        return (
            <Button
                sx={{
                    color: "inherit",
                }}
                endIcon={<LoginIcon />}
                onClick={() => router.push("/login")}
                disabled={router.pathname === "/login"}
            >
                anmelden
            </Button>
        )

    return (
        <>
            <Stack
                direction="row"
                sx={{
                    alignItems: "center",
                }}
            >
                <MUIAvatar
                    sx={{
                        cursor: "pointer",
                        mr: 2,
                    }}
                    onClick={handleToggleContextMenu}
                >
                    <PersonIcon />
                </MUIAvatar>
            </Stack>
            {anchorEL && (
                <ContextMenu
                    anchorEL={anchorEL}
                    open={anchorEL != null}
                    onClose={handleCloseContextMenu}
                />
            )}
        </>
    )
}

export default Avatar
