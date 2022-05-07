import { Color } from './Color';



/**
 *
 * @param red range 0..255
 * @param green range 0..255
 * @param blue range 0..255
 * @param opacity range 0..1
 */
export class RGBColor extends Color {
	public colorLight: string;
	public colorDark?: string

	public darkModeColor(red: number, green: number, blue: number, opacity?: number): this { this.colorDark = `rgba(${red},${green},${blue},${opacity || 1})`; return this }

	constructor(red: number, green: number, blue: number, opacity: number = 1) {
		super();
		this.colorLight = `rgba(${red},${green},${blue},${opacity})`;
	}
}
/**
 *
 * @param red range 0..255
 * @param green range 0..255
 * @param blue range 0..255
 * @param opacity range 0..1
 */
export function rgb(red: number, green: number, blue: number, opacity?: number): RGBColor { return new RGBColor(red, green, blue, opacity) }
