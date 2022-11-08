import { TableDescriptor } from "@intutable/lazy-views"
import { useAPI } from "context"
import useSWR, { unstable_serialize } from "swr"
import { TableData } from "types"
import { ViewDescriptor } from "@intutable/lazy-views"
import { useMemo } from "react"
import { BareFetcher, PublicConfiguration } from "swr/dist/types"

export type TableHookOptions = {
    table?: ViewDescriptor | null
    swrOptions?: Partial<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PublicConfiguration<TableData, any, BareFetcher<TableData>>
    >
}

/**
 * ### useTable hook.
 *
 * Returns the data of a table.
 *
 * It uses the {@link APIContextProvider}
 * to determine the current selected table.
 *
 * @param {Partial<PublicConfiguration<TableData, any, BareFetcher<TableData>>>} [options.swrOptions] Options for the underlying {@link useSWR} hook.
 *
 * @param {ViewDescriptor} [options.table] If you want to fetch a diffrent table than specified in the api context, you can use this option.
 */
export const useTable = (options?: TableHookOptions) => {
    const { table: api_table } = useAPI()

    // if the table param is specified, use that over the api context
    const tableToFetch = useMemo(
        () => (options?.table ? options.table : api_table),
        [api_table, options?.table]
    )

    const { data, error, mutate, isValidating } = useSWR<TableData>(
        tableToFetch
            ? {
                  url: `/api/table/${tableToFetch.id}`,
                  method: "GET",
              }
            : null,
        options?.swrOptions
    )

    return {
        data,
        error,
        mutate,
        loading: (error == null && data == null) || isValidating,
    }
}

/**
 * Config for `useTable` hook.
 */
export const useTableConfig = {
    /**
     * Returns the swr cache key for `useTable`.
     * Can be used to ssr data.
     *
     * Note: the key does **not** neet to be serialized.
     */
    cacheKey: (tableId: TableDescriptor["id"]) =>
        unstable_serialize({
            url: `/api/table/${tableId}`,
            method: "GET",
        }),
}
