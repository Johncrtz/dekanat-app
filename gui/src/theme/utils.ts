/* eslint-disable @typescript-eslint/no-empty-interface */
import { createTheme } from "@mui/material/styles"
import { COLOR_SCHEME } from "./theme"

interface _Theme {
    colorScheme: typeof COLOR_SCHEME
}

interface _ThemeOptions {
    colorScheme?: typeof COLOR_SCHEME
}

declare module "@mui/material/styles" {
    export interface Theme extends _Theme {}
    export interface ThemeOptions extends _ThemeOptions {}
}

export namespace MUIThemeCustomTypes {
    export interface Theme extends _Theme {}
    export interface ThemeOptions extends _ThemeOptions {}
}

export default createTheme
