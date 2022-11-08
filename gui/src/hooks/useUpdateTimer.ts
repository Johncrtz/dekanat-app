import { useRef } from "react"

/**
 * A pending update: If {@link useUpdateTimer.update} is called while the
 * timeout is still running, queue up another update and return a `promise`.
 * Once the last update's cooldown timeout expires, fire `callback`
 * and `resolve` or `reject` the promise.
 */
type PendingUpdate<T> = {
    callback: () => Promise<T>
    resolve: (result: T) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (error: any) => void
}

export class TimeoutError extends Error {
    message: string
    cause?: Error | undefined
    constructor(message: string, cause?: Error | undefined) {
        super(message)
        this.message = message
        this.cause = cause
    }
}

/**
 * A timer for gating how frequently a callback is run.
 * do nothing. The purpose is to enable form input data to be saved to
 * the back-end on the fly as the user edits it, without everything
 * constantly being in a loading state because every single keypress
 * triggered an expensive save operation.
 *
 * The hook has three states:
 * 1. _Idle_: No timeout set, no updates pending, ready to update at any moment.
 * 2. _Waiting_: Update just performed, timeout running, no extra update queued.
 * 3. _Pending_: `update` was called in _Waiting_ state: an extra update is
 *      queued and will run as soon as the timeout expires.
 * When the user calls `update`:
 *   _Idle_: run `callback`, set timeout
 *   _Waiting_: switch to _Pending_, store requested update
 *   _Pending_: do nothing.
 * When the timeout expires:
 *   _Waiting_: switch to _Idle_.
 *   _Pending_: switch to _Waiting_, run pending callback, set new timeout.
 * Notes:
 *    1. this does not save any state or intermediate updates, it merely
 *       limits the frequency of calls to an opaque callback. Ensuring that
 *       the data the callback operates on are correct and up-to-date
 *        _at the time the callback is run_ is the user's responsibility.
 *    2. `update` may be called with an alternative callback each time.
 * @param {() => Promise<Result>} callback the callback for performing
 * whatever update.
 * @param {number} timeout the length of the timeout in milliseconds
 */
export const useUpdateTimer = <Result>(
    callback: () => Promise<Result>,
    timeout: number
) => {
    /**
     * _Idle_: currentTimeout and pendingUpdate are null
     * _Waiting_: currentTimeout not null, pendingUpdate null
     * _Pending_: currentTimeout and pendingUpdate both not null.
     */
    const currentTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pendingUpdate = useRef<PendingUpdate<Result> | null>(null)

    const afterTimeout = () => {
        const pUpdate = pendingUpdate.current
        if (pUpdate === null) {
            currentTimeout.current = null
        } else {
            pUpdate
                .callback()
                .then(value => pUpdate.resolve(value))
                .catch(error => pUpdate.reject(error))
            pendingUpdate.current = null
            currentTimeout.current = setTimeout(afterTimeout, timeout)
        }
    }

    /**
     * Run the update callback and set a timeout.
     * @return {Promise<Result | null>} the result of `callback`, or `null`
     * if another update was already pending.
     */
    const update = (
        altCallback?: () => Promise<Result>
    ): Promise<Result | null> => {
        const cb = altCallback ?? callback
        if (currentTimeout.current === null && pendingUpdate.current === null) {
            const promise = cb()
            currentTimeout.current = setTimeout(afterTimeout, timeout)
            return promise
        } else if (
            currentTimeout.current !== null &&
            pendingUpdate.current === null
        ) {
            // we have to assign these functions right away to keep tsc happy
            let resolve: (result: Result) => void = () => {}
            let reject: (result: Result) => void = () => {}
            const promise = new Promise<Result>((res, rej) => {
                resolve = res
                reject = rej
            })
            pendingUpdate.current = {
                resolve,
                reject,
                callback: cb,
            }
            return promise
        } else return Promise.resolve(null)
    }

    /**
     * Cancel the currently pending update. Its promise is rejected.
     * The timeout continues until it expires as normal.
     * @return {boolean} true if a queued update was cancelled, false if not.
     */
    const cancelUpdate = (cause?: Error | undefined): boolean => {
        if (!pendingUpdate.current) return false
        else {
            pendingUpdate.current.reject(
                new TimeoutError("update cancelled", cause)
            )
            pendingUpdate.current = null
            return true
        }
    }

    return { update, cancelUpdate }
}
