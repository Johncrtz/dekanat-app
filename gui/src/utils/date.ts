export const MONTHS = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
] as const

export const localeDateString = (date: Date) =>
    `${MONTHS[date.getMonth()].slice(
        0,
        3
    )} ${date.getDate()}, ${date.getFullYear()}`
