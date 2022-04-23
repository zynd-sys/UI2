import { Units } from "Enum/Units";




export class GridTrackClass {

	protected growValue?: number
	protected maxValue?: string
	protected value: string
	protected minValue?: string

	public toString(): string {
		let result = this.minValue || this.maxValue ? `clamp(${this.minValue || 0},${this.value},${this.maxValue || '100%'})` : this.value
		return this.growValue ? `minmax(${result},${this.growValue}fr)` : result
	}



	public grow(value: number): this { this.growValue = value; return this }
	public min(value: number, unit: Units = Units.px): this { this.minValue = value.toString() + unit; return this }
	public max(value: number, unit: Units = Units.px): this { this.maxValue = value.toString() + unit; return this }


	constructor(value: number, unit: Units = Units.px) { this.value = value.toString() + unit; }
}

export function GridTrack(value: number, unit: Units = Units.px): GridTrackClass { return new GridTrackClass(value, unit) }