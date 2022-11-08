export type WikiDoc = {
    title: string
    href: string
    description: React.ReactNode
    body: React.ReactNode
    lastEdited: Date
}
export const isWikiDoc = (value: unknown): value is WikiDoc =>
    value != null &&
    typeof value === "object" &&
    "title" in value &&
    "href" in value &&
    "description" in value &&
    "body" in value &&
    "lastEdited" in value

export type WikiNode = {
    title: string
    children: (WikiNode | WikiDoc)[]
}
export const isWikiNode = (value: unknown): value is WikiNode =>
    value != null &&
    typeof value === "object" &&
    "title" in value &&
    "children" in value

export type WikiTree = (WikiNode | WikiDoc)[]
