import { Color } from "./Color"



/**
 *
 * @param hue range 0..360
 * @param saturation range 0..100
 * @param lightness range 0..100
 * @param opacity range 0..1
 */
export class HSLColor extends Color {
	public colorLight: string
	public colorDark?: string

	public darkModeColor(hue: number, saturation: number, lightness: number, opacity?: number): this { this.colorLight = `hsla(${hue},${saturation}%,${lightness}%,${opacity || 1})`; return this }

	constructor(hue: number, saturation: number, lightness: number, opacity: number = 1) {
		super();
		this.colorLight = `hsla(${hue},${saturation}%,${lightness}%,${opacity})`
	}
}
/**
 *
 * @param hue range 0..360
 * @param saturation range 0..100 %
 * @param lightness range 0..100 %
 * @param opacity range 0..1
 */
export function hsl(hue: number, saturation: number, lightness: number, opacity?: number): HSLColor { return new HSLColor(hue, saturation, lightness, opacity) }
