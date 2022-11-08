import { Box } from "@mui/material"
import { TextField } from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { TimePicker } from "@mui/x-date-pickers"
import { isValid as isValidTime } from "date-fns"
import deLocale from "date-fns/locale/de"
import { useState } from "react"
import { FormatterProps } from "react-data-grid"
import { Row } from "types"
import Cell from "../abstract/Cell"
import { TempusCell } from "../abstract/TempusCell"

export class Time extends TempusCell {
    readonly brand = "time"
    label = "Time"

    editor = () => null

    export(value: unknown): string | void {
        const parsed = this.parse(value as string)
        if (parsed == null) return
        return parsed.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    formatter = (props: FormatterProps<Row>) => {
        const {
            row,
            key,
            content: _content,
        } = this.destruct<Date | null>(props)
        const [content, setContent] = useState(_content)

        const handleChange = (date: Date | null) => {
            if (date === null) return erase()
            if (this.isValid(date) === false) return

            props.onRowChange({
                ...row,
                [key]: this.stringify(date),
            })
        }

        // erases the content and sets the value to default (=> nothing)
        const erase = () => {
            props.onRowChange({
                ...row,
                [key]: "",
            })
        }

        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={deLocale}
                    localeText={{
                        openPreviousView: "Stunde setzen",
                        openNextView: "Minuten setzen",
                        clearButtonLabel: "Löschen",
                        cancelButtonLabel: "Abbrechen",
                        okButtonLabel: "OK",
                        todayButtonLabel: "Jetzt",
                        // start: "Start",
                        // end: "Ende",
                    }}
                >
                    <TimePicker
                        showToolbar
                        value={content}
                        onChange={date => setContent(date)} // only update the state, but do not update the actual db (only on blur – see below)
                        onAccept={handleChange} // update the db
                        ampm={false}
                        renderInput={params => (
                            <TextField
                                {...params}
                                onBlur={() => handleChange(content)} // now actually update the db
                                size="small"
                                variant="standard"
                                fullWidth
                                sx={{
                                    m: 0,
                                    mt: 0.5,
                                    p: 0,
                                    height: "100%",
                                    maxHeight: "100%",
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    ...params.InputProps,
                                }}
                            />
                        )}
                        componentsProps={{
                            actionBar: {
                                actions: ["clear", "today", "accept"],
                            },
                        }}
                    />
                </LocalizationProvider>
            </Box>
        )
    }
}
