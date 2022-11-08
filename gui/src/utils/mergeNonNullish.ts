import Obj from "types/Obj"

// TODO: ts support
// type DiscriminatedNonNullishUnion<
//     O1 extends Obj,
//     O2 extends Obj,
//     I extends O1 & O2
// > = {
//         [K in keyof I]: I[K] extends never ? O1[K] extends null | undefines ?
// }

/**
 * Merges two objects together.
 * If properties overlap, non-nullish values are preferred.
 * If overlapping properties have both non-nullish values, the value from `obj2` is preferred.
 *
 * // TODO: not typescript save
 */
export const mergeNonNullish = <R>(obj1: Obj, obj2: Obj): R => {
    const merged: Obj = {}

    for (const key in obj1) {
        if (merged[key] === undefined || merged[key] === null)
            merged[key] = obj1[key]
    }

    for (const key in obj2) {
        if (merged[key] === undefined || merged[key] === null)
            merged[key] = obj2[key]
    }

    return merged as R
}
