import { isJSON, isJSONArray, isJSONObject } from "utils/isJSON"
import Cell from "../abstract/Cell"

export class Text extends Cell {
    readonly brand = "string"
    label = "Text"
}
