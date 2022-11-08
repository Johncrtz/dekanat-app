import { ViewDescriptor } from "@intutable/lazy-views/dist/types"
import { ProjectDescriptor } from "@intutable/project-management/dist/types"
import React, { useEffect, useState } from "react"

export type APIContextProps = {
    project: ProjectDescriptor | null
    setProject: React.Dispatch<React.SetStateAction<ProjectDescriptor | null>>
    table: ViewDescriptor | null
    setTable: React.Dispatch<React.SetStateAction<ViewDescriptor | null>>
    view: ViewDescriptor | null
    setView: React.Dispatch<React.SetStateAction<ViewDescriptor | null>>
}

const initialState: APIContextProps = {
    project: undefined!,
    setProject: undefined!,
    table: undefined!,
    setTable: undefined!,
    view: undefined!,
    setView: undefined!,
}

const APIContext = React.createContext<APIContextProps>(initialState)

export const useAPI = () => React.useContext(APIContext)

export type APIContextProviderProps = {
    project?: ProjectDescriptor
    table?: ViewDescriptor
    view?: ViewDescriptor
    children: React.ReactNode
}

export const APIContextProvider: React.FC<APIContextProviderProps> = props => {
    // TODO: instead of providing the set methods from the useState hook (setTable and setProject) provide a reducer
    // this helps preventing conflicts.
    // If a projects gets set to null, the table must be set to null equally
    const [project, setProject] = useState<ProjectDescriptor | null>(
        props.project || null
    )

    const [table, setTable] = useState<ViewDescriptor | null>(
        props.table || null
    )

    const [view, setView] = useState<ViewDescriptor | null>(props.view || null)

    // BUG: the props change, but the state does not change
    // TODO: use a better solution
    useEffect(() => {
        setProject(props.project || null)
        setTable(props.table || null)
        setView(props.view || null)
    }, [props.project, props.table, props.view])

    return (
        <APIContext.Provider
            value={{
                project,
                setProject,
                table,
                setTable,
                view,
                setView,
            }}
        >
            {props.children}
        </APIContext.Provider>
    )
}
