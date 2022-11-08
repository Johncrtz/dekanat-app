import Cell from "./Cell"
import { isValid as isValidTempus, parse as fns_parse } from "date-fns"
import deLocale from "date-fns/locale/de"
import { NumericCell } from "./NumericCell"

const parse_HH_mm = (str: string) =>
    fns_parse(str, "HH:mm", new Date(), {
        locale: deLocale,
    })

const parse_dd_MM_yyyy = (str: string) =>
    fns_parse(str, "dd.MM.yyyy", new Date(), {
        locale: deLocale,
    })

export abstract class TempusCell extends Cell {
    // https://date-fns.org/v2.29.3/docs/isValid
    isValid(value: unknown): boolean {
        return value == null || value === "" || isValidTempus(value)
    }

    /** Wether the value is a formatted time or date string,
     * if 'true', the parsed string is returned as Date object */
    static isFormattedString(value: unknown): Date | false {
        if (typeof value !== "string") return false

        // Note: https://github.com/date-fns/date-fns/blob/main/docs/unicodeTokens.md
        // https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table

        const isTime = parse_HH_mm(value)
        const isDate = parse_dd_MM_yyyy(value)

        return isValidTempus(isTime)
            ? isTime
            : isValidTempus(isDate)
            ? isDate
            : false
    }

    parse(value: string | null | undefined | Date): Date | null {
        // case nullish
        if (typeof value === "undefined" || value === null || value === "")
            return null

        // case instance
        if (value instanceof Date) return isValidTempus(value) ? value : null // catch invalid dates

        // case timestamp (string or number)
        if (NumericCell.isInteger(value)) {
            const timestamp = Number.parseInt(value as string)
            if (this.isValid(timestamp) === false) return null
            return new Date(timestamp)
        }

        // case exported formatted string e.g. "HH:MM"
        // Note: `Time` and `Date` extend this, so you can convert both bidirectionally
        if (typeof value === "string") {
            const parsed = TempusCell.isFormattedString(value)
            if (parsed !== false) return parsed
        }

        return null
    }

    stringify(value: string | Date | null | undefined): string {
        // ensure value is a Date
        const parsed = this.parse(value) // we can do this bc `parse` is idempotent

        if (parsed === null) return ""

        return parsed.getTime().toString() // save as string
    }

    unexport(value: string): Date {
        const parsed = this.parse(value)

        if (parsed === null)
            throw new RangeError("TempusCell.unexport: invalid value")

        return parsed
    }
}
