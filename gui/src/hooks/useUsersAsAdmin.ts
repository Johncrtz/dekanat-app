import useSWR, { unstable_serialize } from "swr"
import { fetcher } from "api/fetcher"
import { User } from "@backend/permissions"

/**
 * ### useUsers hook.
 *
 * Returns a list of users (as objects for editing, only available to the
 * admin)
 */
export const useUsersAsAdmin = () => {
    const {
        data: users,
        error,
        mutate,
    } = useSWR<User[]>({ url: `/api/permissions/users`, method: "GET" })

    const createUser = async (
        user: Omit<User, "id">,
        password: string
    ): Promise<void> => {
        await fetcher({
            url: `/api/permissions/user`,
            body: { user, password },
            method: "POST",
        })
        await mutate()
    }

    const deleteUser = async (userId: number): Promise<void> => {
        await fetcher({
            url: `/api/permissions/user/${userId}`,
            body: {},
            method: "DELETE",
        })
        await mutate()
    }

    const changeRole = async (
        userId: number,
        roleId: number
    ): Promise<void> => {
        await fetcher({
            url: `/api/permissions/user/${userId}`,
            body: { roleId },
            method: "PATCH",
        })
        await mutate()
    }

    return { users, createUser, deleteUser, changeRole, error, mutate }
}

/**
 * Config for `useUsers` hook.
 */
export const useUsersAsAdminConfig = {
    /**
     * Returns the swr cache key for `useUsersConfig`.
     * Can be used to ssr data.
     *
     * Note: the key does **not** neet to be serialized.
     */
    cacheKey: unstable_serialize({
        url: `/api/permissions/users`,
        method: "GET",
    }),
}
