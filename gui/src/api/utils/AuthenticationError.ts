export class AuthenticationError extends Error {
    public res?: Response

    constructor(
        message: string,
        public httpStatusCode: number,
        cause: Error | Response
    ) {
        super(message, { cause: cause instanceof Error ? cause : undefined })
        this.name = this.constructor.name
        this.res = cause instanceof Error ? undefined : cause
    }
}
