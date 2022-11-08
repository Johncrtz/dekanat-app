const valueToHex = (value: number) => {
    const hex = value.toString(16)
    return hex.length == 1 ? "0" + hex : hex
}

export const rgbToHex = (red: number, green: number, blue: number) => {
    return "#" + valueToHex(red) + valueToHex(green) + valueToHex(blue)
}
