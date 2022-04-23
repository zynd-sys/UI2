import type { CSSLength } from "CSS/Types/MinimalStylesType"
import { Color, DefaultColor } from "Colors"



export class DropShadowStyle {
	public 'offset-x': CSSLength
	public 'offset-y': CSSLength
	public 'blur-radius': CSSLength
	public 'color': Color
	public toString(): string { return `${this['offset-x']} ${this['offset-y']} ${this['blur-radius']} ${this.color}` }

	constructor(offsetX: CSSLength = 0, offsetY: CSSLength = 0, blurRadius: CSSLength = '1rem', color: Color = DefaultColor.black) {
		this['offset-y'] = offsetX;
		this['offset-y'] = offsetY;
		this['blur-radius'] = blurRadius;
		this.color = color;
	}
}

export class InnerShadowStyle extends DropShadowStyle {
	public override toString(): string { return 'inset ' + super.toString() }
}