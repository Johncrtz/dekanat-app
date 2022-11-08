import { ViewDescriptor } from "@intutable/lazy-views"
import { ProjectDescriptor } from "@intutable/project-management/dist/types"
import { useAPI } from "context/APIContext"
import { useEffect, useMemo } from "react"
import useSWR, { unstable_serialize } from "swr"
import { BareFetcher, PublicConfiguration } from "swr/dist/types"

export type UseTablesOptions = {
    project?: ProjectDescriptor | null
    swrOptions?: Partial<
        PublicConfiguration<
            ViewDescriptor[],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            any,
            BareFetcher<ViewDescriptor[]>
        >
    >
}

/**
 * ### useTables hook.
 *
 * Returns a list of tables of a project.
 *
 * It uses the {@link APIContextProvider}
 * to determine the current selected table.
 *
 * @param {Partial<PublicConfiguration<TableData, any, BareFetcher<TableData>>>} [options.swrOptions] Options for the underlying {@link useSWR} hook.
 *
 * @param {ProjectDescriptor | null | undefined} [options.project] If you want to fetch a diffrent list of tables than specified in the api context, you can use this option.
 */
export const useTables = (options?: UseTablesOptions) => {
    const { project: api_project } = useAPI()

    const projectToUse = useMemo(
        () => (options?.project ? options.project : api_project),
        [api_project, options?.project]
    )

    const {
        data: tables,
        error,
        mutate,
        isValidating,
    } = useSWR<ViewDescriptor[]>(
        projectToUse
            ? { url: `/api/tables/${projectToUse.id}`, method: "GET" }
            : null,
        options?.swrOptions
    )

    return {
        tables,
        error,
        mutate,
        loading: (error == null && tables == null) || isValidating,
    }
}

/**
 * Config for `useTables` hook.
 */
export const useTablesConfig = {
    /**
     * Returns the swr cache key for `useTablesConfig`.
     * Can be used to ssr data.
     *
     * Note: the key does **not** neet to be serialized.
     */
    cacheKey: (projectId: ProjectDescriptor["id"]) =>
        unstable_serialize({
            url: `/api/tables/${projectId}`,
            method: "GET",
        }),
}
