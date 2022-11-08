import { Box } from "@mui/material"
import React from "react"
import { EditorProps, FormatterProps } from "react-data-grid"
import { Row } from "types"
import { NumericCell } from "../abstract/NumericCell"

export class Currency extends NumericCell {
    readonly brand = "currency"
    label = "Currency"

    export(value: unknown): string {
        return value + "€"
    }
    unexport(value: string): number {
        const unexported = Number(value.replace("€", "").trim())
        if (NumericCell.isNumeric(unexported) === false)
            throw new RangeError(
                "Currency Cell Debug Error: value is not a number"
            )
        return unexported
    }

    editor = (props: EditorProps<Row>) => {
        const { row, key, content } = this.destruct(props)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
            props.onRowChange({
                ...row,
                [key]: e.target.value,
            })

        return (
            <this.Input
                onChange={handleChange}
                type="number"
                onBlur={() => props.onClose(true)}
                value={content}
            />
        )
    }

    formatter = (props: FormatterProps<Row>) => {
        const { content } = this.destruct(props)

        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                }}
            >
                <>
                    {content}
                    {content && " €"}
                </>
            </Box>
        )
    }
}
