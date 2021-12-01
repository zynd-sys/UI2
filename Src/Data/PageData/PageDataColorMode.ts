// import type { Color } from "../../ViewConstructors/Styles/Colors/Colors";
import { LightObserver } from "../Observed";




export enum ColorMode {
	light,
	dark
}





export class PageDataColorModeClass extends LightObserver {
	protected matchMedia = window.matchMedia('(prefers-color-scheme: light)')
	protected mode?: ColorMode
	// protected textColorValue?: Color
	// protected backgroundColorValue?: Color

	public value: ColorMode = this.matchMedia.matches ? ColorMode.light : ColorMode.dark

	protected mainHandler() {
		if (typeof this.mode == 'number') {
			if (this.mode == this.value) return;
			this.action('value', this.mode);
			document.body.style.setProperty('color', this.value == ColorMode.light ? '#000' : '#fff')
			document.body.style.setProperty('--background-color', this.value == ColorMode.light ? '#fff' : '#000')
			// if (this.textColorValue) document.body.style.setProperty('color', this.textColorValue.toString());
			// if (this.backgroundColorValue) document.body.style.setProperty('--background-color', this.backgroundColorValue.toString());
			return
		}

		this.action('value', this.matchMedia.matches ? ColorMode.light : ColorMode.dark)
		// if (this.textColorValue) document.body.style.setProperty('color', this.textColorValue.toString());
		// if (this.backgroundColorValue) document.body.style.setProperty('--background-color', this.backgroundColorValue.toString());
		document.body.style.setProperty('color', this.value == ColorMode.light ? '#000' : '#fff')
		document.body.style.setProperty('--background-color', this.value == ColorMode.light ? '#fff' : '#000')
	}








	// public textColor(value: Color): this {
	// 	this.textColorValue = value;
	// 	document.body.style.setProperty('color', value.toString());
	// 	return this
	// }
	// public backgroundColor(value: Color): this {
	// 	this.backgroundColorValue = value;
	// 	document.body.style.setProperty('--background-color', this.backgroundColorValue.toString());
	// 	return this
	// }




	public useOnlyColorMode(value?: ColorMode): this { this.mode = value; this.mainHandler(); return this }
	constructor() {
		super();
		this.matchMedia.addEventListener('change', () => this.mainHandler())
	}
}

export const PageDataColorMode = new PageDataColorModeClass;

