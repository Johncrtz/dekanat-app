import { Middleware, SWRHook } from "swr"

export const logger: Middleware =
    (useSWRNext: SWRHook) => (key, fetcher, config) => {
        // Add logger to the original fetcher.
        const extendedFetcher = (
            ...args: Parameters<NonNullable<typeof fetcher>>
        ) => {
            console.info("SWR Request:", key, "(cache key)")
            return fetcher!(...args)
        }

        // Execute the hook with the new fetcher.
        return useSWRNext(key, extendedFetcher, config)
    }
