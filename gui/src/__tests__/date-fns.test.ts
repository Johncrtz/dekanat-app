import { parse, isValid } from "date-fns"
import deLocale from "date-fns/locale/de"

const parse_HH_mm = (str: string) =>
    parse(str, "HH:mm", new Date(), { locale: deLocale })

const parse_DD_MM_YYYY = (str: string) =>
    parse(str, "dd.MM.yyyy", new Date(), { locale: deLocale })

const HH_MM = "00:01"
const HH_MM_parsed = parse_HH_mm(HH_MM)
const HH_MM_SS = "00:00:01"
const HH_MM_SS_parsed = parse(HH_MM_SS, "HH:mm:ss", new Date(), {
    locale: deLocale,
})
const DD_MM_YYYY = "01.01.2021"
const D_M_YY = "1.1.21"
const DD_MM_YYYY_parsed = parse(DD_MM_YYYY, "dd.MM.yyyy", new Date(), {
    locale: deLocale,
})

describe("date-fns", () => {
    it("should parse 'hh:mm' correctly", () => {
        expect(HH_MM_parsed).toBeInstanceOf(Date)
        expect(HH_MM_SS_parsed).toBeInstanceOf(Date)
        expect(DD_MM_YYYY_parsed).toBeInstanceOf(Date)

        expect(isValid(parse_HH_mm(HH_MM))).toBeTruthy()
        expect(isValid(parse_HH_mm(HH_MM_SS))).toBeFalsy()
        expect(isValid(parse_HH_mm(DD_MM_YYYY))).toBeFalsy()
    })

    it("should parse 'dd.mm.yyyy' correctly", () => {
        expect(isValid(parse_DD_MM_YYYY(D_M_YY))).toBeTruthy()
    })
})
