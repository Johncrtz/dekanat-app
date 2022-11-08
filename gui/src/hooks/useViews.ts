import { ViewDescriptor } from "@intutable/lazy-views"
import useSWR, { unstable_serialize } from "swr"
import { fetcher } from "api"
import { useAPI } from "context/APIContext"
import { TableHookOptions } from "./useTable"
import { useMemo } from "react"

/**
 * ### useViews hook.
 *
 * Returns a list of views on a given table.
 */
export const useViews = (options?: TableHookOptions) => {
    const { view: currentView, setView, table: api_table } = useAPI()

    // if the table param is specified, use that over the api context
    const tableToFetch = useMemo(
        () => (options?.table ? options.table : api_table),
        [api_table, options?.table]
    )

    const {
        data: views,
        error,
        mutate,
    } = useSWR<ViewDescriptor[]>(
        tableToFetch
            ? { url: `/api/views/${tableToFetch.id}`, method: "GET" }
            : null
    )

    /**
     * Create a new view with a given name, returning its descriptor.
     */
    const createView = async (name: string): Promise<ViewDescriptor | null> => {
        if (!tableToFetch) return null
        const view = await fetcher<ViewDescriptor>({
            url: "/api/view",
            body: {
                tableId: tableToFetch.id,
                name,
            },
            method: "POST",
        })
        return view
    }

    const renameView = async (
        viewId: ViewDescriptor["id"],
        newName: string
    ): Promise<void> => {
        if (!currentView) return
        await fetcher({
            url: `/api/view/${viewId}`,
            body: { newName },
            method: "PATCH",
        })
        await mutate()
    }

    /**
     * Delete a view. If the deleted view is the currently selected one, also
     * set a new current view.
     */
    const deleteView = async (viewId: ViewDescriptor["id"]): Promise<void> => {
        return fetcher<void>({
            url: `/api/view/${viewId}`,
            body: {},
            method: "DELETE",
        }).then(async () => {
            if (viewId === currentView?.id && views && views.length > 0)
                setView(views[0])
            await mutate()
        })
    }

    return { views, createView, renameView, deleteView, error, mutate }
}

/**
 * Config for `useViews` hook.
 */
export const useViewsConfig = {
    /**
     * Returns the swr cache key for `useViewsConfig`.
     * Can be used to ssr data.
     *
     * Note: the key does **not** need to be serialized.
     */
    cacheKey: (tableId: ViewDescriptor["id"]) =>
        unstable_serialize({
            url: `/api/views/${tableId}`,
            method: "GET",
        }),
}
