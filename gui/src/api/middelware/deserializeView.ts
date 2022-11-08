import SerDes from "utils/SerDes"
import { Middleware, SWRHook } from "swr"
import { ViewData } from "types"

/**
 * Deserializes {@link ViewData}. As of now, this type is only returned
 * from the `/pages/api/view/[viewId]` endpoint
 */
export const deserializeView: Middleware =
    (useSWRNext: SWRHook) => (key, fetcher, config) => {
        const swr = useSWRNext(key, fetcher, config)

        if (
            key == null ||
            Object.prototype.hasOwnProperty.call(key, "url") === false
        )
            return swr

        const routeKey: string = (key as { url: string }).url
        // "/api/view/[id]"
        const routeRegex = RegExp("/api/view/\\d*")
        if (routeRegex.test(routeKey) === false || swr.data == null) return swr

        const viewData = swr.data as unknown as ViewData.Serialized

        // deserialize
        const deserializedViewData: ViewData.Deserialized =
            SerDes.deserializeView(viewData)

        return Object.assign({}, swr, {
            data: deserializedViewData,
        })
    }
