import { Units } from "../Enum/Units";




export class GridTrackClass {
	protected value: string


	public toString(): string { return this.value }


	constructor(minValue: number, minUnit: Units = Units.px,maxValue: number = 1, maxUnit: Units | 'fr' = 'fr'  ) { this.value = `minmax(${minValue}${minUnit},${maxValue}${maxUnit}`; }
}

export function GridTrack(value: number, unit: Units = Units.px): GridTrackClass { return new GridTrackClass(value, unit) }