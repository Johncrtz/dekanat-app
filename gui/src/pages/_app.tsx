import { CssBaseline, PaletteMode, useMediaQuery } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { fetcher } from "api"
import { logger, deserializeView } from "api/middelware"
import Layout from "components/Layout/Layout"
import type { AppProps } from "next/app"
import Head from "next/head"
import { SnackbarProvider } from "notistack"
import React, { useEffect, useMemo, useState } from "react"
import { SWRConfig } from "swr"
import { getDesignToken } from "theme"
import createTheme from "theme/utils"
import ErrorIcon from "@mui/icons-material/Error"

type ThemeTogglerContextProps = {
    toggleColorMode: () => void
    getTheme: () => PaletteMode
}
const ThemeTogglerContext = React.createContext<ThemeTogglerContextProps>(
    undefined!
)
export const useThemeToggler = () => React.useContext(ThemeTogglerContext)
export const THEME_MODE_STORAGE_KEY = "__USER_THEME_PREFERENCE__"

const MyApp = (props: AppProps) => {
    const { Component, pageProps } = props

    // const systemPreferredThemeMode: PaletteMode = useMediaQuery(
    //     "(prefers-color-scheme: dark)"
    // )
    //     ? "dark"
    //     : "light"

    // const [themeMode, setThemeMode] = useState<PaletteMode>(
    //     systemPreferredThemeMode
    // )
    const themeMode = "light"

    // useEffect(() => {
    //     const userPreferredThemeMode = localStorage.getItem(
    //         THEME_MODE_STORAGE_KEY
    //     )
    //     setThemeMode(
    //         (userPreferredThemeMode as PaletteMode) || systemPreferredThemeMode
    //     )
    // }, [systemPreferredThemeMode])

    // const colorMode = useMemo(
    //     () => ({
    //         toggleColorMode: () => {
    //             setThemeMode((prevMode: PaletteMode) =>
    //                 prevMode === "light" ? "dark" : "light"
    //             )
    //         },
    //         getTheme: () => themeMode,
    //     }),
    //     [themeMode]
    // )

    const colorMode = {
        toggleColorMode: () => {},
        getTheme: (): PaletteMode => "light",
    }

    const theme = useMemo(
        () => createTheme((() => getDesignToken(themeMode))()),
        [themeMode]
    )

    return (
        <>
            <Head>
                {/* Responsive */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta charSet="utf-8" />
                {/* Favicons */}
                <link
                    rel="shortcut icon"
                    type="image/x-icon"
                    href="/favicon.ico"
                />
                {/* Safari Tab Bar Style */}
                <meta name="theme-color" content={theme.palette.primary.main} />
            </Head>

            <SWRConfig
                value={{
                    fetcher: fetcher,
                    use: [logger, deserializeView],
                    onError: err => console.error(err),
                    // suspense: true, // not supported for ssr as of now
                    revalidateOnFocus: false,
                }}
            >
                <ThemeTogglerContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <SnackbarProvider
                            autoHideDuration={2500}
                            maxSnack={5}
                            dense
                            preventDuplicate
                            iconVariant={{
                                error: (
                                    <ErrorIcon
                                        fontSize="small"
                                        sx={{ mr: 1 }}
                                    />
                                ),
                            }}
                        >
                            <CssBaseline />
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </SnackbarProvider>
                    </ThemeProvider>
                </ThemeTogglerContext.Provider>
            </SWRConfig>
        </>
    )
}

export default MyApp
