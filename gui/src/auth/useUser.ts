import { useEffect } from "react"
import Router from "next/router"
import useSWR from "swr"
import type { User } from "types/User"
import { AuthenticationError } from "api/utils/AuthenticationError"
import { isErrorLike } from "utils/error-handling/ErrorLike"
import { fetcher } from "api"

type UseUserOptions = {
    /**
     * if successfully logged in, the user will be
     * redirected to this url
     * @default "" (empty string)
     */
    redirectTo?: string
    /**
     *
     */
    redirectIfFound?: boolean
}

const UseUserDefaultOptions: UseUserOptions = {
    redirectTo: "",
    redirectIfFound: false,
}

export const useUser = (options: UseUserOptions = UseUserDefaultOptions) => {
    const { redirectTo, redirectIfFound } = options

    const {
        data: user,
        mutate: mutateUser,
        error,
        isValidating,
    } = useSWR<User>({
        url: "/api/auth/user",
    })

    useEffect(() => {
        // if no redirect needed, just return
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || user == null || error != null || isValidating) return

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        )
            Router.push(redirectTo)
    }, [user, redirectIfFound, redirectTo, error, isValidating])

    useEffect(() => {
        if (error) console.error("auth error:", error)
        if (
            error instanceof AuthenticationError ||
            (isErrorLike(error) && error.name === "AuthenticationError")
        ) {
            console.error("AuthenticationError")
            Router.push("/login")
        }
    }, [error])

    return {
        user,
        mutateUser,
        error,
        isLoading: (user == null && error == null) || isValidating,
    }
}
