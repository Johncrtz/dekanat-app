import { SerializableError } from "../SerializableError"

/**
 *
 */
export class IsTakenError extends SerializableError {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options)
        this.name = this.constructor.name
    }
}
