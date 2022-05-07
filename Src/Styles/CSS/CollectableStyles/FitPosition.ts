import type { CSSLength } from "../Types/MinimalStylesType";


export type FitPositionCSSType = `${CSSLength} ${CSSLength}`

export class FitPositionStyle {
	public x: CSSLength
	public y: CSSLength

	public toString(): FitPositionCSSType { return `${this.x} ${this.y}` }

	constructor(x: CSSLength = 0, y: CSSLength = 0) {
		this.x = x;
		this.y = y
	}
}