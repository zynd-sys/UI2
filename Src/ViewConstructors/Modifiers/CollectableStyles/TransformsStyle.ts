import type { CSSAngle, CSSLength } from "CSS/Types/MinimalStylesType";

export interface TransformStyleInterface {
	'rotateX'?: CSSAngle
	'rotateY'?: CSSAngle
	'rotateZ'?: CSSAngle
	'scaleX'?: number
	'scaleY'?: number
	'scaleZ'?: number
	'skewX'?: CSSAngle
	'skewY'?: CSSAngle
	'translateX'?: CSSLength
	'translateY'?: CSSLength
	'translateZ'?: CSSLength
}


export class TransformsStyle extends Map<keyof TransformStyleInterface, TransformStyleInterface[keyof TransformStyleInterface]> {
	public override toString(): string {
		let str: string = '';
		this.forEach((value, property) => { if (value !== undefined) str += ` ${property}(${value.toString()})` })
		return str
	}
	constructor() { super() }
}
export interface TransformsStyle extends Map<keyof TransformStyleInterface, TransformStyleInterface[keyof TransformStyleInterface]> {
	get<P extends keyof TransformStyleInterface>(key: P): TransformStyleInterface[P]
	set<P extends keyof TransformStyleInterface>(key: P, value?: TransformStyleInterface[P]): this
}