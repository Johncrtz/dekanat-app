/**
 * On creating a standard column, these are the properties that must be
 * specified.
 * TODO: make Column.Serialized a subtype of this
 */
export type StandardColumnSpecifier = {
    name: string
    _cellContentType: string
    editable: boolean
}
