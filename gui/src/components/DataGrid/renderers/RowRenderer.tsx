import { css } from "@emotion/css"
import { Menu, MenuItem, PaletteMode } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import clsx from "clsx"
import { useRow } from "hooks/useRow"
import { useSnackbar } from "notistack"
import React, { useCallback, useState } from "react"
import { Row as GridRow, RowRendererProps } from "react-data-grid"
import { useDrag, useDrop } from "react-dnd"
import { Row } from "types"

/**
 * // TODO: This component needs to be highly performant and memoized...
 */

const rowDraggingClassname = css`
    opacity: 0.5;
    cursor: "move";
`

const rowOverClassname = (themeMode: PaletteMode) => css`
    background-color: ${themeMode === "dark" ? "#dedede" : "#888"};
`

/**
 * Row Renderer
 */
const _RowRenderer = (props: RowRendererProps<Row>) => {
    const theme = useTheme()
    const { enqueueSnackbar } = useSnackbar()
    const { deleteRow, onRowReorder, createRow } = useRow()

    // draggable
    const [{ isDragging }, drag] = useDrag({
        type: "ROW_DRAG",
        item: { index: props.rowIdx },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const [{ isOver }, drop] = useDrop({
        accept: "ROW_DRAG",
        drop({ index }: { index: number }) {
            onRowReorder(index, props.rowIdx)
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    const className = clsx(props.className, {
        [rowDraggingClassname]: isDragging,
        [rowOverClassname(theme.palette.mode)]: isOver,
    })

    // context menu

    const [anchorEL, setAnchorEL] = useState<HTMLDivElement | null>(null)

    const handleOpenContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        setAnchorEL(event.currentTarget.children[0] as HTMLDivElement)
    }
    const handleCloseContextMenu = () => setAnchorEL(null)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDeleteRow = useCallback(
        async (index: number, row: Row) => {
            try {
                handleCloseContextMenu()
                await deleteRow(row)
            } catch (error) {
                enqueueSnackbar("Die Zeile konnte nicht gelöscht werden.")
            }
        },
        [deleteRow, enqueueSnackbar]
    )

    const handleCreateRow = useCallback(
        async (atIndex: number) => {
            try {
                await createRow(atIndex)
                handleCloseContextMenu()
            } catch (error) {
                enqueueSnackbar("Es konnte keine Zeile eingefügt werden.")
            }
        },
        [createRow, enqueueSnackbar]
    )

    return (
        <>
            <GridRow
                ref={ref => {
                    if (ref) drag(ref.children[1])
                    drop(ref)
                }}
                onContextMenu={handleOpenContextMenu}
                {...props}
                className={className}
            />
            <Menu
                elevation={0}
                // anchorOrigin={{ vertical: "top", horizontal: "right" }}
                // transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={anchorEL != null}
                anchorEl={anchorEL}
                onClose={handleCloseContextMenu}
                PaperProps={{
                    sx: {
                        boxShadow: theme.shadows[1],
                    },
                }}
            >
                <MenuItem onClick={handleCreateRow.bind(null, props.rowIdx)}>
                    Zeile oberhalb einfügen
                </MenuItem>
                <MenuItem
                    onClick={handleDeleteRow.bind(
                        null,
                        props.rowIdx,
                        props.row
                    )}
                    sx={{ color: theme.palette.warning.main }}
                >
                    Zeile löschen
                </MenuItem>
                <MenuItem
                    onClick={handleCreateRow.bind(null, props.rowIdx + 1)}
                >
                    Zeile unterhalb einfügen
                </MenuItem>
            </Menu>
        </>
    )
}

export const RowRenderer = React.memo(_RowRenderer)
