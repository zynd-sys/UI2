import type { Color } from "../Colors/Colors"
import { DefaultColor } from "../Colors/DefaultColors"



export class DropShadowStyle {
	public 'offset-x': string = '0'
	public 'offset-y': string = '0'
	public 'blur-radius': string = '1rem'
	public 'color': Color = DefaultColor.black
	public toString(): string { return `${this['offset-x']} ${this['offset-y']} ${this['blur-radius']} ${this.color}` }
}

export class InnerShadowStyle extends DropShadowStyle {
	public override toString(): string { return 'inset ' + super.toString() }
}