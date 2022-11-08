import Cell from "./abstract/Cell"

export class Cells extends Array<Cell> {
    constructor(...cells: Cell[]) {
        super(...cells)
    }

    public getCell(brand: string): Cell {
        const cell = this.find(cell => cell.brand === brand)
        if (cell == null) throw new Error(`No cell found for brand '${brand}'`)
        return cell
    }

    public getBrands(): string[] {
        return this.map(cell => cell.brand)
    }

    public getLabels(): string[] {
        return this.map(cell => cell.label)
    }

    /** Map<brand, label> */
    public getMap(): Map<string, string> {
        return new Map(this.map(cell => [cell.brand, cell.label]))
    }
}
