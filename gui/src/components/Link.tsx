import type { LinkTypeMap } from "@mui/material"
import { Link as MUILink } from "@mui/material"
import type { LinkProps } from "next/link"
import NextLink from "next/link"
import React from "react"
import Obj from "types/Obj"

export type CombinedLinkProps = {
    href: string
    /**
     * If true, the <Link /> from mui will be wrapped by the <Link /> from Next in order
     * to handle in-app routing. Otherwise this is not needed.
     * @default 'true'
     */
    internal?: boolean
    /**
     * these props will be forwarded to the NextJS Link Component
     */
    nextLinkProps?: Omit<LinkProps, "href">
    /**
     * these props will be forwarded to the mui Link Component
     */
    muiLinkProps?: LinkTypeMap<Obj, "a">["props"]
    children?: React.ReactNode
}

/**
 * Combination of NextJS's Link and MUI's Link to provide proper routing AND styling.
 * @param {CombinedLinkProps} param
 * @returns
 */
const CombinedLink: React.FC<CombinedLinkProps> = ({
    children,
    href,
    internal = true,
    nextLinkProps,
    muiLinkProps,
}) => {
    if (!internal)
        return (
            <MUILink href={href} color="inherit" {...muiLinkProps}>
                {children}
            </MUILink>
        )
    else
        return (
            <NextLink href={href} passHref {...nextLinkProps}>
                <MUILink color="inherit" {...muiLinkProps}>
                    {children}
                </MUILink>
            </NextLink>
        )
}

export default CombinedLink
