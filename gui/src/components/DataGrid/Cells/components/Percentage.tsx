import { Box } from "@mui/material"
import LinearProgress, {
    LinearProgressProps,
} from "@mui/material/LinearProgress"
import Typography from "@mui/material/Typography"
import React from "react"
import { EditorProps, FormatterProps } from "react-data-grid"
import { Row } from "types"
import Cell from "../abstract/Cell"
import { NumericCell } from "../abstract/NumericCell"

const LinearProgressWithLabel = (
    props: LinearProgressProps & { value: number }
) => (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress
                variant="determinate"
                sx={{
                    borderRadius: 100,
                }}
                {...props}
            />
        </Box>
        <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
                {props.value} %
            </Typography>
        </Box>
    </Box>
)

export class Percentage extends NumericCell {
    readonly brand = "percentage"
    label = "Percentage"

    isValid(value: unknown): boolean {
        if (typeof value === "string" && NumericCell.isNumeric(value)) {
            const number = NumericCell.isInteger(value)
                ? Number.parseInt(value)
                : Number.parseFloat(value)
            return number >= 0 && number <= 100
        }
        return (
            (typeof value === "number" && value >= 0 && value <= 100) ||
            value == null ||
            value === ""
        )
    }

    export(value: unknown): string {
        return value + "%"
    }
    unexport(value: string): number {
        const unexported = Number(value.replace("%", "").trim())
        if (NumericCell.isNumeric(unexported) === false)
            throw new RangeError(
                "Percentage Cell Debug Error: value is not a number"
            )
        return unexported
    }

    editor = (props: EditorProps<Row>) => {
        const { row, key, content } = this.destruct<number | null>(props)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = this.parse(e.target.value) // value gets back as a string and needs to be parsed
            if (this.isValid(value) || value == null)
                // if it was an empty string, it became 'null'
                props.onRowChange({
                    ...row,
                    [key]: value ?? "", // and then it needs to be saved as an empty string
                })
        }

        return (
            <this.Input
                onChange={handleChange}
                type="number"
                onBlur={() => props.onClose(true)}
                value={content}
                componentsProps={{
                    input: {
                        min: 0,
                        max: 100,
                    },
                }}
            />
        )
    }

    formatter = (props: FormatterProps<Row>) => {
        const { content } = this.destruct<number | null>(props)

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
                {this.isValid(content) && (
                    <LinearProgressWithLabel value={content!} />
                )}
            </Box>
        )
    }
}
