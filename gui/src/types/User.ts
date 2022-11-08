import type { Role } from "@backend/permissions/types"

export type User = {
    username: string
    authCookie: string
    id: number
    isLoggedIn: boolean
    role: Role
}
