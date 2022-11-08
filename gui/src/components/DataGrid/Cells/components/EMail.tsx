import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"
import { Box, IconButton, Tooltip } from "@mui/material"
import { useEffect, useState } from "react"
import { EditorProps, FormatterProps } from "react-data-grid"
import { Row } from "types"
import { isValidEMailAddress } from "utils/isValidEMailAddress"
import Cell from "../abstract/Cell"

export class EMail extends Cell {
    readonly brand = "email"
    label = "E-Mail"

    isValid(value: unknown): boolean {
        return value == null || value === "" || isValidEMailAddress(value)
    }

    editor = (props: EditorProps<Row>) => {
        const { row, key, content } = this.destruct(props)

        const [input, setInput] = useState(content ?? "")

        useEffect(() => {
            if (this.isValid(input)) {
                props.onRowChange({
                    ...row,
                    [key]: input,
                })
            }
        }, [input, key, props, row])

        return (
            <this.Input
                onChange={e => setInput(e.target.value)}
                onBlur={() => props.onClose(true)}
                value={input}
            />
        )
    }

    formatter = (props: FormatterProps<Row>) => {
        const { content } = this.destruct<string | null | undefined>(props)

        if (
            this.isValid(content) === false ||
            content == null ||
            content.length < 1
        )
            return null

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
                <Tooltip title={content!} arrow placement="top">
                    <IconButton
                        size="small"
                        href={`mailto:${content}`}
                        color="success"
                    >
                        <MarkEmailReadIcon
                            sx={{
                                fontSize: "90%",
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
        )
    }
}
