import { Divider, Toolbar as MUIToolbar } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Box } from "@mui/system"
import React from "react"

type ToolbarProps = {
    position: "top" | "bottom"
    children: React.ReactNode
}

const Toolbar: React.FC<ToolbarProps> = props => {
    const theme = useTheme()

    const children = React.Children.toArray(props.children)

    return (
        <MUIToolbar
            sx={{
                border: "1px solid",
                borderColor: theme.palette.divider,
                ...theme.mixins.toolbar,
                overflowX: "scroll",
                px: theme.spacing(1),
                borderTopLeftRadius:
                    props.position === "top" ? theme.shape.borderRadius : 0,
                borderTopRightRadius:
                    props.position === "top" ? theme.shape.borderRadius : 0,
                borderBottomLeftRadius:
                    props.position === "bottom" ? theme.shape.borderRadius : 0,
                borderBottomRightRadius:
                    props.position === "bottom" ? theme.shape.borderRadius : 0,
            }}
            disableGutters
        >
            {children.map((child, index) =>
                index + 1 === children.length ? (
                    <Box key={index}>{child}</Box>
                ) : (
                    [
                        <Box key={index}>{child}</Box>,
                        <Divider
                            key={`${index}-divider`}
                            orientation="vertical"
                            flexItem
                            variant="middle"
                            sx={{
                                mx: theme.spacing(1),
                            }}
                        />,
                    ]
                )
            )}
        </MUIToolbar>
    )
}

export default Toolbar
