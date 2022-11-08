import { IconButton, IconButtonProps, Tooltip } from "@mui/material"
import React from "react"

export type PrefixIconProps = {
    title: string
    open: boolean
    iconButtonProps?: IconButtonProps
    /**
     * the prefix icon
     */
    children: React.ReactNode
}

export const PrefixIcon: React.FC<PrefixIconProps> = props => {
    if (props.open === false) return null

    return (
        <Tooltip title={props.title}>
            <span>
                <IconButton size="small" {...props.iconButtonProps}>
                    {props.children}
                </IconButton>
            </span>
        </Tooltip>
    )
}
