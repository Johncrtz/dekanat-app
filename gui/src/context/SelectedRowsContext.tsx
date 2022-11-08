import React, { useEffect, useState } from "react"
import { useAPI } from "./APIContext"

export type SelectedRowsContextProps = {
    selectedRows: ReadonlySet<number>
    setSelectedRows: React.Dispatch<React.SetStateAction<ReadonlySet<number>>>
}

const initialState: SelectedRowsContextProps = {
    selectedRows: new Set(),
    setSelectedRows: undefined!,
}

const SelectedRowsContext =
    React.createContext<SelectedRowsContextProps>(initialState)

export const useSelectedRows = () => React.useContext(SelectedRowsContext)

export const SelectedRowsContextProvider: React.FC<{
    children: React.ReactNode
}> = props => {
    const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(
        () => new Set()
    )

    const resetSelectedRows = () => setSelectedRows(() => new Set())

    // resets row selection on table change
    const { table } = useAPI()
    useEffect(() => resetSelectedRows(), [table])

    return (
        <SelectedRowsContext.Provider
            value={{
                selectedRows,
                setSelectedRows,
            }}
        >
            {props.children}
        </SelectedRowsContext.Provider>
    )
}
