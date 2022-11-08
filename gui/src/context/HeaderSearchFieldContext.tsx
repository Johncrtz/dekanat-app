import React, { useState } from "react"

export type HeaderSearchFieldContextProps = {
    open: boolean
    headerHeight: number
    openSearchField: () => void
    closeSearchField: () => void
}

const initialState: HeaderSearchFieldContextProps = {
    open: false,
    headerHeight: 35,
    openSearchField: undefined!,
    closeSearchField: undefined!,
}

const HeaderSearchFieldContext =
    React.createContext<HeaderSearchFieldContextProps>(initialState)

export const useHeaderSearchField = () =>
    React.useContext(HeaderSearchFieldContext)

type HeaderSearchFieldProviderProps = {
    children: React.ReactNode
}

export const HeaderSearchFieldProvider: React.FC<
    HeaderSearchFieldProviderProps
> = props => {
    const [open, setOpen] = useState<boolean>(initialState.open)
    const [headerHeight, setHeaderHeight] = useState<number>(
        initialState.headerHeight
    )

    const openSearchField = () => {
        setHeaderHeight(70)
        setOpen(true)
    }
    const closeSearchField = () => {
        setHeaderHeight(35)
        setOpen(false)
    }

    return (
        <HeaderSearchFieldContext.Provider
            value={{
                open,
                headerHeight,
                openSearchField,
                closeSearchField,
            }}
        >
            {props.children}
        </HeaderSearchFieldContext.Provider>
    )
}
