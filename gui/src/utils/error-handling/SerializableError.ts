import Obj from "types/Obj"
import { ErrorLike, isErrorLike } from "./ErrorLike"

const replacer = (key: string, value: unknown) => {
    // if value is the stack or cause, it needs to be serialized too
    if (value instanceof Error) {
        const error: Obj = {}

        Object.getOwnPropertyNames(value).forEach(prop => {
            Object.defineProperty(error, prop, {
                value: value[prop as keyof typeof value],
                writable: true,
                enumerable: true,
                configurable: true,
            })
        })

        return error
    }

    // other values
    return value
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctor<T> = new (...args: any[]) => T
type _Ctor<T, P = unknown> = new () => T
type ErrorObject = ErrorLike

/**
 * Serializable Error Class
 */
export class SerializableError extends Error {
    constructor(...args: Parameters<typeof Error>) {
        super(...args)
        this.name = SerializableError.name
    }

    static fromJSON<T>(this: Ctor<T>, value: string): T {
        const parsed = JSON.parse(value) as Obj
        if (isErrorLike(parsed) === false)
            throw new RangeError(`Could not instantiate from argument 'value'!`)
        const err = parsed as ErrorLike
        if (this.name !== err.name)
            throw new RangeError(
                `Could not instantiate from serialized error of type '${err.name}' to '${this.name}'`
            )
        // const instance = Object.create(
        //     this.prototype,
        //     Object.getOwnPropertyDescriptors(parsed)
        // )

        // return instance as T
        // TODO
        return new this()
    }

    /**
     * Serialize an error object to JSON.
     */
    static toJSON(error: Error): string {
        return JSON.stringify(error, replacer)
    }

    /**
     * This is just the same as `serialize`,
     * but it returns JSON instead of an plain object.
     */
    public toJSON(): string {
        return JSON.stringify(this, replacer)
    }

    // static [Symbol.hasInstance]<T>(this: Ctor<T>, instance: unknown): boolean {
    //     if (typeof instance !== "string") return false
    //     try {
    //         const deserialized = SerializableError.deserialize(instance)
    //         if (deserialized.name !== this.name) return false
    //         return true
    //     } catch {
    //         return false
    //     }
    // }

    /**
     * Serialize this error.
     */
    public serialize() {
        // return SerializableError.serialize(this)
        return
    }

    /**
     * Serialize an error object.
     */
    // static serialize<T extends Error>(error: T): ErrorObject {
    //     return
    // }

    /**
     * Deserialize an error or error like object.
     */
    static deserialize<T>(this: Ctor<T>, error: ErrorObject): T {
        return new this() // TODO: implement
    }
}

// ### Middleware ###
type ErrorCtor<T> = new (...args: unknown[]) => T
type SerializableErrorCtor = typeof SerializableError

export class DeserializationMiddleware {
    private knownConstructors: Map<string, ErrorCtor<SerializableErrorCtor>>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(classes?: Array<ErrorCtor<any>>) {
        this.knownConstructors = new Map()
        // classes?.forEach()
    }

    public addClass<T extends SerializableErrorCtor>(ctor: ErrorCtor<T>): this {
        this.knownConstructors.set(ctor.name, ctor)
        return this
    }

    public removeClass<T extends SerializableErrorCtor>(
        ctor: ErrorCtor<T>
    ): this {
        this.knownConstructors.delete(ctor.name)
        return this
    }

    public async middleware(res: Response): Promise<Response> {
        const data = (await res.json()) as unknown

        if (isErrorLike(data)) {
            const err = data as ErrorLike
            const ctor = this.knownConstructors.get(err.name)
            if (ctor == null) return res
            // TODO:
        }

        return res
    }
}
