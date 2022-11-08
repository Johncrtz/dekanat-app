import type { ParsedUrlQuery } from "querystring"

export type DynamicRouteQuery<
    Q extends ParsedUrlQuery,
    K extends string
> = NonNullable<Q> & {
    [key in K]: string
}
