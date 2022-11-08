import { ProjectDescriptor } from "@intutable/project-management/dist/types"
import useSWR, { unstable_serialize } from "swr"

/**
 * ### useProjects hook.
 *
 * Returns a list of projects.
 */
export const useProjects = () => {
    const {
        data: projects,
        error,
        mutate,
    } = useSWR<ProjectDescriptor[]>({ url: `/api/projects`, method: "GET" })

    return { projects, error, mutate }
}

/**
 * Config for `useProjects` hook.
 */
export const useProjectsConfig = {
    /**
     * Returns the swr cache key for `useProjectsConfig`.
     * Can be used to ssr data.
     *
     * Note: the key does **not** neet to be serialized.
     */
    cacheKey: unstable_serialize({ url: `/api/projects`, method: "GET" }),
}
