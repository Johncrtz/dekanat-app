import React from "react"
import { FormatterProps } from "react-data-grid"
import { Row } from "types"

export type FormatterComponent = React.FunctionComponent<FormatterProps<Row>>
