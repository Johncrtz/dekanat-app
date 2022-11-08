import Obj from "./Obj"

/**
 * Remapps recusrivley all types of 'OLD' (wether it's a union, primitive or compley)
 * to 'NEW' in an object.
 *
 * // TODO: works fine, but does not remove 'undefined' when declared in union type
 */
export type Convert<OLD, NEW, O extends Obj> = {
    [K in keyof O]: O[K] extends OLD
        ? NEW
        : O[K] extends Obj
        ? Convert<OLD, NEW, O[K]>
        : O[K]
}
