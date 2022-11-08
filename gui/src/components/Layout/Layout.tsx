import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import React from "react"
import Header from "./Header"

type LayoutProps = {
    children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = props => {
    const theme = useTheme()

    return (
        <Box sx={{ display: "flex" }}>
            <Header />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: theme.spacing(8),
                    pt: theme.spacing(14), // BUG: hacky bugfix to get the content in main below the appbar, those are overlapping
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                {props.children}
            </Box>
        </Box>
    )
}

export default Layout
