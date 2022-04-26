import type { DropShadowStyle } from './ShadowStyle';
import type { CSSAngle, CSSLength, CSSVariable } from 'CSS/Types/MinimalStylesType';
import type { Units } from 'Enum/Units';




export interface FilterStyleInterface {
	'blur'?: CSSLength | CSSVariable<CSSLength>
	'brightness'?: number | `${number}${Units.absolute}` | CSSVariable<number>
	'contrast'?: number | `${number}${Units.absolute}` | CSSVariable<number>
	'grayscale'?: number | `${number}${Units.absolute}` | CSSVariable<number>
	'hueRotate'?: CSSAngle | CSSVariable<number>
	'invert'?: number | `${number}${Units.absolute}` | CSSVariable<number>
	'opacity'?: number | `${number}${Units.absolute}` | CSSVariable<number>
	'saturate'?: number | `${number}${Units.absolute}` | CSSVariable<number>
	'sepia'?: number | `${number}${Units.absolute}`
	'drop-shadow'?: DropShadowStyle
}

export class FiltersStyle extends Map<keyof FilterStyleInterface, FilterStyleInterface[keyof FilterStyleInterface]> {
	public getCollectableStyles(key: 'drop-shadow', constructor: new (...p: any[]) => NonNullable<FilterStyleInterface['drop-shadow']>, ...constructorParameters: any[]): NonNullable<FilterStyleInterface['drop-shadow']> {
		let v = this.get(key);
		if (!v) this.set(key, v = new constructor(...constructorParameters))
		return v
	}

	public override toString(): string {
		let str: string = '';
		this.forEach((value, property) => { if (value !== undefined) str += ` ${property}(${value.toString()})` })
		return str
	}
	constructor() { super() }
}
export interface FiltersStyle extends Map<keyof FilterStyleInterface, FilterStyleInterface[keyof FilterStyleInterface]> {
	get<P extends keyof FilterStyleInterface>(key: P): FilterStyleInterface[P]
	set<P extends keyof FilterStyleInterface>(key: P, value?: FilterStyleInterface[P]): this
}