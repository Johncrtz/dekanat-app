import useSWR, { unstable_serialize } from "swr"
import { Role } from "@backend/permissions"

/**
 * ### useRoles hook.
 *
 * Returns a list of projects.
 */
export const useRoles = () => {
    const {
        data: roles,
        error,
        mutate,
    } = useSWR<Role[]>({ url: `/api/permissions/roles`, method: "GET" })

    return { roles, error, mutate }
}
