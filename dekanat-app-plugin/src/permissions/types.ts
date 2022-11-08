export type User = {
    id: number
    email: string
    role: Role
}

/**
 * temp, should eventually be provided by permission plugin
 */
export type Role = {
    id: number
    roleKind?: RoleKind
    name: string
    description: string
}

export enum RoleKind {
    /** Full Privileges. */
    Admin,
    /** No privileges, not even viewing tables. */
    Guest,
}
