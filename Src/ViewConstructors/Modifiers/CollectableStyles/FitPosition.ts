import type { CSSLength } from "../CSS/Types/MinimalStylesType";


export class FitPositionStyle {
	public x: CSSLength
	public y: CSSLength

	public toString(): string { return `${this.x} ${this.y}` }

	constructor(x: CSSLength = 0, y: CSSLength = 0) {
		this.x = x;
		this.y = y
	}
}