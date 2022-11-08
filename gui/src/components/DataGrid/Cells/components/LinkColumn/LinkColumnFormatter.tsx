import { FormatterComponent } from "@datagrid/Cells/types/FormatterComponent"
import { getId } from "@intutable/lazy-views/dist/selectable"
import { Box, Stack, Tooltip } from "@mui/material"
import { fetcher } from "api"
import { useColumn } from "hooks/useColumn"
import { useRow } from "hooks/useRow"
import { useSnacki } from "hooks/useSnacki"
import { useTables } from "hooks/useTables"
import { useTable } from "hooks/useTable"
import { useView } from "hooks/useView"
import React, { useCallback, useMemo, useState } from "react"
import { Row } from "types"
import { DeleteButton } from "./DeleteButton"
import { RowSelector } from "./RowSelector"

/**
 * @deprecated
 *
 * This formatter is no usual cell component
 * but a meta wrapper
 *
 * This should be refactored in a much simpler way
 */

const _LinkColumnFormatter: FormatterComponent = props => {
    const { row, column } = props
    const { snackError } = useSnacki()

    const [anchorEL, setAnchorEL] = useState<Element | null>(null)
    const handleOpenModal = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault()
        setAnchorEL(event.currentTarget)
    }
    const handleCloseModal = () => setAnchorEL(null)

    const { getTableColumn } = useColumn()
    const { tables } = useTables()
    const { data, mutate: mutateTable } = useTable()
    const { mutate: mutateView } = useView()
    const { getRowId } = useRow()

    const metaColumn = useMemo(
        () => (data ? getTableColumn(column) : null),
        [column, data, getTableColumn]
    )

    const join = useMemo(() => {
        if (metaColumn == null) return null
        return data!.metadata.joins.find(j => j.id === metaColumn!.joinId)!
    }, [data, metaColumn])

    const foreignTable = useMemo(() => {
        if (join == null || tables == null) return
        return tables.find(tbl => tbl.id === getId(join.foreignSource))!
    }, [join, tables])

    const key = column.key as keyof Row
    const content = row[key] as string | null | undefined
    const hasContent = content && content.length > 0

    const [deleteIconVisible, setDeleteIconVisible] = useState<boolean>(false)

    const handleDeleteContent = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            try {
                event.stopPropagation()
                await fetcher({
                    url: `/api/join/${join!.id}`,
                    body: {
                        tableId: data!.metadata.descriptor.id,
                        rowId: getRowId(row),
                        value: null,
                    },
                })
                await mutateTable()
                await mutateView()
            } catch (error) {
                snackError("Der Inhalt konnte nicht gelöscht werden")
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, join, mutateTable, row]
    )

    if (join == null || foreignTable == null) return null

    return (
        <>
            <Tooltip
                enterDelay={1000}
                arrow
                title={`Link ${hasContent ? "ändern" : "hinzufügen"}`}
            >
                <Box
                    onMouseOver={() => setDeleteIconVisible(true)}
                    onMouseOut={() => setDeleteIconVisible(false)}
                    onClick={handleOpenModal}
                    sx={{
                        width: "100%",
                        height: "100%",
                        cursor: "cell",
                    }}
                >
                    <Stack direction="row">
                        <Box flexGrow="1">{content}</Box>
                        {deleteIconVisible && hasContent && (
                            <DeleteButton onDelete={handleDeleteContent} />
                        )}
                    </Stack>
                </Box>
            </Tooltip>
            <RowSelector
                rowId={getRowId(row)}
                join={join}
                foreignTable={foreignTable}
                open={anchorEL != null}
                onClose={handleCloseModal}
            />
        </>
    )
}

export const LinkColumnFormatter = React.memo(_LinkColumnFormatter)
export default LinkColumnFormatter
