import type { DropShadowStyle } from "./ShadowStyle";

export interface FilterStyleInterface {
	'blur'?: string
	'brightness'?: number
	'contrast'?: number
	'grayscale'?: number
	'hueRotate'?: string
	'invert'?: number
	'opacity'?: number
	'saturate'?: number
	'sepia'?: number
	'drop-shadow'?: DropShadowStyle
}

export class FiltersStyle extends Map<keyof FilterStyleInterface, FilterStyleInterface[keyof FilterStyleInterface]> {
	public getCollectableStyles(key: 'drop-shadow', constructor: new (...p: any[]) => NonNullable<FilterStyleInterface['drop-shadow']>, ...constructorParameters: any[]): NonNullable<FilterStyleInterface['drop-shadow']> {
		let v = this.get(key);
		if (!v) this.set(key, v = new constructor(...constructorParameters))
		return v
	}

	public toString(): string {
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