import { Box, TextField, Typography } from "@mui/material"
import { SxProps, Theme } from "@mui/material"
import { fetcher } from "api"
import { useUser } from "auth/useUser"
import MetaTitle from "components/MetaTitle"
import { LoginRegisterPaper } from "components/LoginRegisterPaper"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import React, { useCallback, useMemo, useState } from "react"
import { User } from "types/User"
import { makeError } from "utils/error-handling/utils/makeError"

const validateUsername = (username: string): true | Error =>
    username.length > 7
        ? true
        : new Error("Der Benutzername muss mindestens 8 Zeichen lang sein!")
const validatePassword = (password: string): true | Error =>
    password.length > 7
        ? true
        : new Error("Das Passwort muss mindestens 8 Zeichen lang sein!")

type FormData = {
    username: string
    password: string
}

// TODO: whenever an error is set, that error box moves other components. Set an absolute position for the error boxes by `errorStyle`
const textFieldStyle: SxProps<Theme> = {
    my: 2,
}

const Login: NextPage = () => {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const error = useMemo(
        () => (router.query.error ? makeError(router.query.error) : null),
        [router.query.error]
    )

    const { mutateUser } = useUser({
        redirectTo: "/projects",
        redirectIfFound: true,
    })

    const [usernameValid, setUsernameValid] = useState<Error | true | null>(
        null
    )
    const [passwordValid, setPasswordValid] = useState<Error | true | null>(
        null
    )
    const [form, setForm] = useState<FormData>({
        username: "",
        password: "",
    })

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setForm(prev => ({ username: value, password: prev.password }))
        if (value.length === 0) return setUsernameValid(null)
        const isValid = validateUsername(value)
        setUsernameValid(isValid)
    }
    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setForm(prev => ({ username: prev.username, password: value }))
        if (value.length === 0) return setPasswordValid(null)
        const isValid = validatePassword(value)
        setPasswordValid(isValid)
    }

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleLogin()
        }
    }

    const handleLogin = useCallback(async () => {
        if (usernameValid !== true || passwordValid !== true || error != null)
            return

        const body = {
            username: form.username,
            password: form.password,
        }

        try {
            await mutateUser(
                await fetcher<User>({ url: "/api/auth/login", body })
            )
        } catch (error) {
            enqueueSnackbar(makeError(error).message, { variant: "error" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        error,
        form.password,
        form.username,
        mutateUser,
        passwordValid,
        usernameValid,
    ])

    return (
        <>
            <MetaTitle title="Anmelden" />
            <Box
                onKeyPress={handleEnter}
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <LoginRegisterPaper
                    mode="login"
                    handleAction={handleLogin}
                    loading={false}
                    disabled={
                        usernameValid instanceof Error ||
                        usernameValid == null ||
                        passwordValid instanceof Error ||
                        passwordValid == null
                    }
                >
                    <TextField
                        autoFocus
                        value={form.username}
                        onChange={handleUsername}
                        label="E-Mail"
                        placeholder="yourid@uni-heidelberg.de"
                        type="email"
                        required
                        error={usernameValid instanceof Error}
                        helperText={
                            usernameValid instanceof Error
                                ? usernameValid.message
                                : undefined
                        }
                        fullWidth
                        sx={textFieldStyle}
                        variant="standard"
                    />
                    <TextField
                        value={form.password}
                        onChange={handlePassword}
                        label="Passwort"
                        placeholder="pw1234"
                        type="password"
                        required
                        error={passwordValid instanceof Error}
                        helperText={
                            passwordValid instanceof Error
                                ? passwordValid.message
                                : undefined
                        }
                        fullWidth
                        sx={textFieldStyle}
                        variant="standard"
                    />
                    {error && (
                        <Typography sx={{ color: "red" }}>
                            {error.message}
                        </Typography>
                    )}
                </LoginRegisterPaper>
            </Box>
        </>
    )
}

export default Login
