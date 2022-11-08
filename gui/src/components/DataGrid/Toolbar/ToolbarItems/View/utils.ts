export const getFilterColor = (nestingDepth: number): string => {
    if (nestingDepth % 1 !== 0 || nestingDepth % 4 === 0) return "#ffffff"
    else if (nestingDepth % 4 === 1 || nestingDepth % 4 === 3) return "#eeeeee"
    else return "#dddddd"
}
