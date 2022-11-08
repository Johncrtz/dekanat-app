import { RoleKind } from "./types"

export const ADMIN_ROLE = {
    id: 0,
    roleKind: RoleKind.Admin,
    name: "Admin",
    description: "Vollzugriff auf alle Objektdaten und Schemata.",
}
export const GUEST_ROLE = {
    id: 1,
    name: "Gastbenutzer",
    roleKind: RoleKind.Guest,
    description: "Kein Zugriff auf irgendwelche Daten.",
}
