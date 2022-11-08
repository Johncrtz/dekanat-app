import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useAPI } from "context"
import { useTables } from "hooks/useTables"
import { useRouter } from "next/router"
import React from "react"

export const TableNavigator: React.FC = () => {
    const theme = useTheme()
    const router = useRouter()

    const { project, table: currentTable } = useAPI()
    const { tables: tableList } = useTables()

    if (tableList == null) return null

    return (
        <>
            <ToggleButtonGroup
                value={currentTable!.id}
                exclusive
                onChange={(
                    event: React.MouseEvent<HTMLElement, MouseEvent>,
                    value: unknown
                ) => {
                    if (value == null || value === "null") return

                    router.push(
                        "/project/" + project!.id + "/table/" + value,
                        undefined,
                        { shallow: false }
                    )
                }}
                color="primary"
                sx={{ display: "block", mb: theme.spacing(5) }}
            >
                {tableList.map((table, index) => (
                    <ToggleButton key={index} value={table.id}>
                        {table.name}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </>
    )
}
export default TableNavigator
