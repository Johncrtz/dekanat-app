export const MailAddressRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function isValidEMailAddress(value: unknown): boolean {
    if (typeof value !== "string") return false
    return MailAddressRegex.test(value.toLowerCase())
}
