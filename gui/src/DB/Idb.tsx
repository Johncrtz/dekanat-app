interface Datum {
    "Values" : String[]
    "Required": boolean
}
export interface Name {
    "Values" : String[]
    "Required": boolean
}
export interface Vorname {
    "Values" : String[]
    "Required": boolean
}
export interface Interdisziplinär {
    "Values" : String[]
    "Required": boolean
}
export interface BetreuerFakultätsmitglied {
    "Values" : String[]
    "Required": boolean
}
export interface Falltyp {
    "Values" : String[]
    "Required": boolean
}
export interface Unterlagenkomplett {
    "Values" : String[]
    "Required": boolean
}
export interface StatusTodo {
    "Values" : String[]
    "Required": boolean
}
export interface Entscheidung {
    "Values" : String[]
    "Required": boolean
}
export interface Auflage1 {
    "Values" : String[]
    "Required": boolean
}
export interface Auflage2 {
    "Values" : String[]
    "Required": boolean
}
export interface Auflage3 {
    "Values" : String[]
    "Required": boolean
}
export interface Table {
    "ID": number;
    "Datum": Datum[];
    "Name": Name[];
    "Vorname": Vorname[];
    "Interdisziplinär?": Interdisziplinär[]
    "Betreuer Fakultätsmitglied": BetreuerFakultätsmitglied[];
    "Falltyp": Falltyp[];
    "Unterlagen komplett?": Unterlagenkomplett[];
    "Status / Todo": StatusTodo[];
    "Entscheidung": Entscheidung[];
    "Auflage 1": Auflage1[];
    "Auflage 2": Auflage2[];
    "Auflage 3": Auflage3[];
    "Kommentar": string;
}

export default Table

