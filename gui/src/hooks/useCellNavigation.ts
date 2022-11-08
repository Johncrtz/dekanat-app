import { useState } from "react"
import { CellNavigationMode } from "react-data-grid"

/**
 * ### useCellNavigation hook
 */
export const useCellNavigation = () => {
    const [cellNavigationMode, setCellNavigationMode] =
        useState<CellNavigationMode>("CHANGE_ROW")

    // TODO: update in db and expose to settings page

    return { cellNavigationMode, setCellNavigationMode }
}
