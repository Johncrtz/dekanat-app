import { OptionsObject, useSnackbar } from "notistack"

/**
 * Simplifies the {@link useSnackbar} hook.
 */
export const useSnacki = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const snackError = (
        message: string,
        options?: Omit<OptionsObject, "variant">
    ) => enqueueSnackbar(message, { variant: "error", ...options })

    const snackWarning = (
        message: string,
        options?: Omit<OptionsObject, "variant">
    ) => enqueueSnackbar(message, { variant: "warning", ...options })

    const snackSuccess = (
        message: string,
        options?: Omit<OptionsObject, "variant">
    ) => enqueueSnackbar(message, { variant: "success", ...options })

    const snackInfo = (
        message: string,
        options?: Omit<OptionsObject, "variant">
    ) => enqueueSnackbar(message, { variant: "info", ...options })

    const snack = (message: string, options?: Omit<OptionsObject, "variant">) =>
        enqueueSnackbar(message, { variant: "default", ...options })

    return {
        snackError,
        snackWarning,
        snackSuccess,
        snackInfo,
        snack,
        closeSnackbar,
    }
}
