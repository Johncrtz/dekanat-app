import React, { useState } from "react"
import FilterListIcon from "@mui/icons-material/FilterList"
import { Button, Tooltip } from "@mui/material"
import { Filter } from "types/filter"
import { defaultViewName } from "@backend/defaults"
import { ColumnUtility } from "utils/ColumnUtility"
import { useTable } from "hooks/useTable"
import { useView } from "hooks/useView"
import { useSnacki } from "hooks/useSnacki"
import { makeError } from "utils/error-handling/utils/makeError"
import { FilterWindow } from "./FilterWindow"

const CANNOT_EDIT_DEFAULT_VIEW_MESSAGE =
    "Standardsicht kann nicht geändert werden."
/**
 * Button to open the filter editor
 */
export const FilterWindowButton: React.FC = () => {
    const { snackInfo, snackError } = useSnacki()

    const { data: tableData } = useTable()
    const { data: viewData, updateFilters } = useView()

    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    const openEditor = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setAnchorEl(e.currentTarget)
    const closeEditor = () => setAnchorEl(null)
    const toggleEditor = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (anchorEl) return closeEditor()

        openEditor(event)
    }

    const handleUpdateFilters = async (newFilters: Filter[]): Promise<void> => {
        try {
            await updateFilters(newFilters)
        } catch (error) {
            const err = makeError(error)
            if (err.message === "changeDefaultView")
                snackInfo(CANNOT_EDIT_DEFAULT_VIEW_MESSAGE)
            else snackError("Filter erstellen fehlgeschlagen.")
        }
    }

    if (!tableData || !viewData) return null

    return (
        <>
            <Tooltip
                title={
                    viewData.descriptor.name === defaultViewName()
                        ? CANNOT_EDIT_DEFAULT_VIEW_MESSAGE
                        : "Filter einstellen"
                }
                enterDelay={1000}
            >
                <span>
                    <Button
                        startIcon={<FilterListIcon />}
                        onClick={toggleEditor}
                        disabled={
                            viewData.descriptor.name === defaultViewName()
                        }
                    >
                        Filter
                    </Button>
                </span>
            </Tooltip>
            {anchorEl && (
                <FilterWindow
                    anchorEl={anchorEl}
                    columns={tableData.columns.filter(
                        c => !ColumnUtility.isAppColumn(c)
                    )}
                    activeFilters={viewData.filters}
                    onHandleCloseEditor={closeEditor}
                    onUpdateFilters={handleUpdateFilters}
                />
            )}
        </>
    )
}
