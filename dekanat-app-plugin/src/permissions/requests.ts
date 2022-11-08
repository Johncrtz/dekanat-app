import { CoreRequest, CoreResponse } from "@intutable/core"
import { CHANNEL } from "../requests"
import { User, Role, RoleKind } from "./types"
import { ADMIN_ROLE, GUEST_ROLE } from "./constants"

/** Do not mess with the 1:1 correspondence between id and array index pls */
const roles: Role[] = [
    ADMIN_ROLE,
    GUEST_ROLE,
    {
        id: 2,
        name: "Hiwi-Sekretariat",
        description:
            "Lesezugriff auf Einrichtungen (nicht" +
            " auf deren Mitglieder, Zeilenschreibzugriff auf die" +
            ' "Hiwi"-Tabelle. Kann keine Tabellenschemata ändern.',
    },
    {
        id: 3,
        name: "Geschäftsführung des Dekanats",
        description:
            "Lesezugriff auf Einrichtungen," +
            " Lese- und Zeilenschreibzugriff auf Personen, Lesezugriff" +
            " auf alle anderen Tabellen, kein Zugriff auf Tabellenschemata.",
    },
]

let users: User[] = [
    {
        id: 1,
        email: "final@boss.com",
        role: roles[3],
    },
    {
        id: 2,
        email: "not@logged.in",
        role: roles[1],
    },
    {
        id: 3,
        email: "hiwi@mathinf.uni-heidelberg.de",
        role: roles[2],
    },
]

/**
 * List all users.
 */
export function getUsers() {
    return { channel: CHANNEL, method: getUsers.name }
}
// the actual handler, for listenForRequests(CHANNEL).on(...)
export async function getUsers_() {
    return users
}

/**
 * List all roles.
 */
export function getRoles() {
    return { channel: CHANNEL, method: getRoles.name }
}
// the actual handler, for listenForRequests(CHANNEL).on(...)
export async function getRoles_() {
    return roles
}

/**
 * Create a new user (lasts until the app is shut down)
 */
export function createUser(user: Omit<User, "id">, password: string) {
    return { channel: CHANNEL, method: createUser.name, user, password }
}
export function createUser_({
    user,
    password,
}: CoreRequest): Promise<CoreResponse> {
    const newID =
        users
            .map(u => u.id)
            .reduce((max, next) => (next > max ? next : max), 0) + 1
    users.push({ ...user, id: newID })
    return Promise.resolve({ message: "user created." })
}

/**
 * Change the role of a user.
 */
export function changeRole(userID: number, roleID: number) {
    return { channel: CHANNEL, method: changeRole.name, userID, roleID }
}
export async function changeRole_({
    userID,
    roleID,
}: CoreRequest): Promise<CoreResponse> {
    const uindex = users.findIndex(u => u.id === userID)
    if (uindex === -1)
        return Promise.reject({ message: "no user with ID " + userID })
    else {
        const role = roles[roleID]
        if (!role)
            return Promise.reject({ message: "no role with ID " + roleID })
        else {
            users[uindex] = {
                ...users[uindex],
                role: role,
            }
            return Promise.resolve({
                message: `assigned role #${roleID} to user #${userID}`,
            })
        }
    }
}

/**
 * Delete a user.
 */
export function deleteUser(userID: number) {
    return { channel: CHANNEL, method: deleteUser.name, userID }
}
export async function deleteUser_({
    userID,
}: CoreRequest): Promise<CoreResponse> {
    const index = users.findIndex(u => u.id === userID)
    if (index === -1)
        return Promise.reject({ message: "no user with ID " + userID })
    else {
        users = users.slice(0, index).concat(users.slice(index + 1))
        return Promise.resolve({
            message: `deleted user #${userID}`,
        })
    }
}
