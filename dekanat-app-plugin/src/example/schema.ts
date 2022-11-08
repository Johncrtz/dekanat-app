/**
 * Specifications of example data.
 */
import {
    Column,
    ColumnType,
    SimpleColumnOption,
} from "@intutable/database/dist/types"
import {
    TableDescriptor,
    ViewDescriptor,
} from "@intutable/lazy-views/dist/types"

import {
    standardColumnAttributes,
    indexColumnAttributes,
    linkColumnAttributes,
} from "../defaults"

export const PK_COLUMN = "_id"

export type JoinSpec = {
    table: string
    fkColumn: Column
    pkColumn: string
    linkColumns: { name: string; attributes: Record<string, unknown> }[]
}
export type TableSpec = {
    name: string
    columns: { baseColumn: Column; attributes: Record<string, unknown> }[]
    joins: JoinSpec[]
}
export type Table = {
    baseTable: TableDescriptor
    tableView: ViewDescriptor
    filterView: ViewDescriptor
}

export const PERSONEN: TableSpec = {
    name: "Personen",
    columns: [
        {
            baseColumn: {
                name: "_id",
                type: ColumnType.increments,
                options: [SimpleColumnOption.primary],
            },
            attributes: standardColumnAttributes("ID", "number", 0),
        },
        {
            baseColumn: {
                name: "index",
                type: ColumnType.integer,
                options: [],
            },
            attributes: indexColumnAttributes(1),
        },
        {
            baseColumn: {
                name: "nachname",
                type: ColumnType.string,
            },
            attributes: standardColumnAttributes("Nachname", "string", 2, true),
        },
        {
            baseColumn: {
                name: "vorname",
                type: ColumnType.string,
            },
            attributes: standardColumnAttributes("Vorname", "string", 3),
        },
        {
            baseColumn: {
                name: "titel",
                type: ColumnType.string,
            },
            attributes: standardColumnAttributes("Titel", "string", 4),
        },
        {
            baseColumn: {
                name: "stellung",
                type: ColumnType.string,
            },
            attributes: standardColumnAttributes("Stellung", "string", 5),
        },
    ],
    joins: [],
}

export const PERSONEN_DATA = [
    {
        index: 0,
        nachname: "Bayer",
        vorname: "Walter",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
    {
        index: 1,
        nachname: "Ahrens",
        vorname: "Rüdiger",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
    {
        index: 2,
        nachname: "van Beek",
        vorname: "Boris",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
    {
        index: 3,
        nachname: "Grabosch",
        vorname: "Heinrich",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
    {
        index: 4,
        nachname: "Rech",
        vorname: "Larissa",
        titel: "Dr.",
        stellung: "FK-Leitung",
    },
    {
        index: 5,
        nachname: "Heussen",
        vorname: "Hannelore",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
    {
        index: 6,
        nachname: "Leidermann",
        vorname: "Fabian",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
    {
        index: 7,
        nachname: "Sydow",
        vorname: "Antonia",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
    {
        index: 8,
        nachname: "Haeberlein",
        vorname: "Mareike",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
    {
        index: 9,
        nachname: "Zaech",
        vorname: "Sören",
        titel: "Prof. Dr.",
        stellung: "Professor",
    },
]

export const ORGANE: TableSpec = {
    name: "Organe",
    columns: [
        {
            baseColumn: {
                name: "_id",
                type: ColumnType.increments,
                options: [SimpleColumnOption.primary],
            },
            attributes: standardColumnAttributes("ID", "number", 0),
        },
        {
            baseColumn: {
                name: "index",
                type: ColumnType.integer,
                options: [],
            },
            attributes: indexColumnAttributes(1),
        },
        {
            baseColumn: {
                name: "name",
                type: ColumnType.text,
            },
            attributes: standardColumnAttributes("Name", "string", 2, true),
        },
        {
            baseColumn: {
                name: "kuerzel",
                type: ColumnType.text,
            },
            attributes: standardColumnAttributes("Kürzel", "string", 3),
        },
        {
            baseColumn: {
                name: "typ",
                type: ColumnType.text,
            },
            attributes: standardColumnAttributes("Typ", "string", 4),
        },
        {
            baseColumn: {
                name: "fk_math_inf",
                type: ColumnType.text,
            },
            attributes: standardColumnAttributes("FK/Math/Inf", "string", 5),
        },
    ],
    joins: [],
}

export const ORGANE_DATA = [
    {
        index: 0,
        name: "StuKo Mathematik",
        kuerzel: "SK Math",
        typ: "Kommission",
        fk_math_inf: "Math",
    },
    {
        index: 1,
        name: "Dekanat",
        kuerzel: "Dekanat",
        typ: "Einrichtung",
        fk_math_inf: "FK",
    },
    {
        index: 2,
        name: "Fakultätsvorstand",
        kuerzel: "FK-Vorstand",
        typ: "Kommission",
        fk_math_inf: "FK",
    },
    {
        index: 3,
        name: "Institut für Angewandte Mathematik",
        kuerzel: "IAM",
        typ: "Einrichtung",
        fk_math_inf: "Math",
    },
    {
        index: 4,
        name: "Institut für Informatik",
        kuerzel: "IfI",
        typ: "Einrichtung",
        fk_math_inf: "Inf",
    },
    {
        index: 5,
        name: "Institut für Technische Informatik",
        kuerzel: "ZITI",
        typ: "Einrichtung",
        fk_math_inf: "Inf",
    },
    {
        index: 6,
        name: "Mathematisches Institut",
        kuerzel: "MI",
        typ: "Einrichtung",
        fk_math_inf: "Math",
    },
    {
        index: 7,
        name: "PA BA und MA Informatik",
        kuerzel: "PA BA+MA Inf",
        typ: "Kommission",
        fk_math_inf: "Inf",
    },
    {
        index: 8,
        name: "PA Informatik Promotionen",
        kuerzel: "PA Prom Inf",
        typ: "Kommission",
        fk_math_inf: "Inf",
    },
    {
        index: 9,
        name: "PA Lehramt Informatik",
        kuerzel: "PA LA Inf",
        typ: "Kommission",
        fk_math_inf: "Inf",
    },
    {
        index: 10,
        name: "PA Math Promotionen",
        kuerzel: "PA Prom Math",
        typ: "Kommission",
        fk_math_inf: "Math",
    },
    {
        index: 11,
        name: "StuKo Informatik",
        kuerzel: "SK Inf",
        typ: "Kommission",
        fk_math_inf: "Inf",
    },
]

export const ROLLEN = {
    name: "Rollen",
    columns: [
        {
            baseColumn: {
                name: "_id",
                type: ColumnType.increments,
                options: [SimpleColumnOption.primary],
            },
            attributes: standardColumnAttributes("ID", "number", 0),
        },
        {
            baseColumn: {
                name: "index",
                type: ColumnType.integer,
                options: [],
            },
            attributes: indexColumnAttributes(1),
        },
        {
            baseColumn: {
                name: "rolle",
                type: ColumnType.string,
                options: [SimpleColumnOption.nullable],
            },
            attributes: standardColumnAttributes("Rolle", "string", 2, true),
        },
    ],
    joins: [
        {
            table: "Personen",
            fkColumn: {
                name: "j#1_fk",
                type: ColumnType.integer,
            },
            pkColumn: "_id",
            linkColumns: [
                {
                    name: "nachname",
                    attributes: linkColumnAttributes("Nachname", 3),
                },
            ],
        },
        {
            table: "Organe",
            fkColumn: {
                name: "j#2_fk",
                type: ColumnType.integer,
            },
            pkColumn: "_id",
            linkColumns: [
                {
                    name: "name",
                    attributes: linkColumnAttributes("Organ", 4),
                },
            ],
        },
    ],
}

export const ROLLEN_DATA = [
    {
        index: 0,
        rolle: "Vorsitz",
        "j#1_fk": 6,
        "j#2_fk": 10,
    },
    {
        index: 1,
        rolle: "Prodekan",
        "j#1_fk": 10,
        "j#2_fk": 2,
    },
    {
        index: 2,
        rolle: "Dekan",
        "j#1_fk": 6,
        "j#2_fk": 2,
    },
    {
        index: 3,
        rolle: "Vorsitz",
        "j#1_fk": 3,
        "j#2_fk": 11,
    },
    {
        index: 4,
        rolle: "Mitglied",
        "j#1_fk": 10,
        "j#2_fk": 11,
    },
    {
        index: 5,
        rolle: "Vorsitz",
        "j#1_fk": 7,
        "j#2_fk": 12,
    },
    {
        index: 6,
        rolle: "Vorsitz",
        "j#1_fk": 2,
        "j#2_fk": 9,
    },
    {
        index: 7,
        rolle: "Vorsitz",
        "j#1_fk": 4,
        "j#2_fk": 1,
    },
    {
        index: 8,
        rolle: "Vorsitz",
        "j#1_fk": 10,
        "j#2_fk": 8,
    },
]
