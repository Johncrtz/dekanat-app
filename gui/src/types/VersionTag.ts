type PrereleaseTagVersion = `.${number}` | ""
type PrereleaseTags = `-alpha` | `-beta` | `-rc`

/**
 * type for semver version tag
 *
 * @param PRE prerelease tag
 */
export type VersionTag = `v${number}.${number}.${number}${
    | `${PrereleaseTags}${PrereleaseTagVersion}`
    | ""}`
