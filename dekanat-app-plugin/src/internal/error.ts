export type JsonError = {
    method: string
    message: string
    reason: unknown
}

export function error(
    method: string,
    message: string,
    reason?: unknown
): JsonError {
    let reason_: unknown
    if (reason instanceof Error) reason_ = reason.toString()
    else reason_ = reason
    return {
        method,
        message,
        reason: reason_,
    }
}
