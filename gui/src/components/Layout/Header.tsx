import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import {
    AppBar,
    Box,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useUser } from "auth"
import Link from "components/Link"
import Avatar from "components/Layout/Avatar"
import React, { useState } from "react"
import Drawer from "./Drawer"
import { Search, SearchIconWrapper, StyledInputBase } from "./SearchBar"

const drawerWidth = 240

const Header = () => {
    const theme = useTheme()
    const { user } = useUser()

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    const toggleDrawer = () => setDrawerOpen(prev => !prev)

    return (
        <>
            {/* Header */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    transition: theme.transitions.create(["width", "margin"], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    ...(drawerOpen && {
                        marginLeft: drawerWidth,
                        width: `calc(100% - ${drawerWidth}px)`,
                        transition: theme.transitions.create(
                            ["width", "margin"],
                            {
                                easing: theme.transitions.easing.sharp,
                                duration:
                                    theme.transitions.duration.enteringScreen,
                            }
                        ),
                    }),
                }}
            >
                <Toolbar
                    sx={{
                        // keeps right padding when drawer closed
                        pr: "24px",
                        // ...theme.mixins.toolbar,
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            mr: "36px",
                            ...(drawerOpen && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" sx={{ alignItems: "center" }}>
                            <Link href="/" muiLinkProps={{ underline: "none" }}>
                                <Typography
                                    variant="h6"
                                    component="h1"
                                    color="inherit"
                                    noWrap
                                    sx={{
                                        fontWeight:
                                            theme.typography.fontWeightBold,
                                    }}
                                >
                                    Dekanatsverwaltung
                                </Typography>
                            </Link>
                            {/* {user?.isLoggedIn && (
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Suche..."
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Search>
                            )} */}
                        </Stack>
                    </Box>
                    <Avatar />
                </Toolbar>
            </AppBar>

            {/* Drawer Menu */}
            <Drawer
                width={drawerWidth}
                open={drawerOpen}
                toggle={toggleDrawer}
            />
        </>
    )
}

export default Header
