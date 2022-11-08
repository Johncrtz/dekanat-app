/**
 * Shortcut for primitive object type / Record type.
 * Note that keys are restricted to strings!
 */
type Obj<T = unknown> = Record<string, T>

export default Obj
