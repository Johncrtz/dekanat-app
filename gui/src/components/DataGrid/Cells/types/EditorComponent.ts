import { Row } from "types"
import React from "react"
import { EditorProps } from "react-data-grid"

export type EditorComponent = React.ComponentType<EditorProps<Row>>
export default EditorComponent
