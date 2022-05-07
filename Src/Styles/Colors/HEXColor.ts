import { Color } from './Color'




export class HEXColor extends Color {
	public colorLight: string;
	public colorDark?: string;

	public darkModeColor(value: string, opacity?: number): this {
		if (value.length == 4) value = value.padEnd(7, value[2])
		this.colorDark = value + (opacity ? Math.ceil(opacity * 255).toString(16).padStart(2, '0').toUpperCase() : '');
		return this
	}

	constructor(value: string, opacity?: number) {
		super();
		if (value.length == 4) value = value.padEnd(7, value[2]);
		this.colorLight = value + (opacity ? Math.ceil(opacity * 255).toString(16).padStart(2, '0').toUpperCase() : '');
	}
}

export function hex(value: string, opacity?: number): HEXColor { return new HEXColor(value, opacity) }