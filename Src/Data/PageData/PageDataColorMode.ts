// import type { Color } from '../../ViewConstructors/Styles/Colors/Colors';
import {  ColorScheme, PrefersColorSchemeCSSMedia, PrefersColorSchemeValue, setPrefersPriorityColorScheme } from '../../Styles/Colors/PrefersColorSchemeCSSMedia';
import { LightObserver } from '../Observed';










export class PageDataColorModeClass extends LightObserver {
	protected mode?: ColorScheme
	// protected textColorValue?: Color
	// protected backgroundColorValue?: Color

	public value: ColorScheme

	protected mainHandler() {
		if (typeof this.mode == 'number') {
			if (this.mode == this.value) return;
			document.body.style.setProperty('color', this.value == ColorScheme.light ? '#000' : '#fff')
			document.body.style.setProperty('--background-color', this.value == ColorScheme.light ? '#fff' : '#000')

			this.action('value', this.mode);
			// if (this.textColorValue) document.body.style.setProperty('color', this.textColorValue.toString());
			// if (this.backgroundColorValue) document.body.style.setProperty('--background-color', this.backgroundColorValue.toString());
			return
		}
		// if (this.textColorValue) document.body.style.setProperty('color', this.textColorValue.toString());
		// if (this.backgroundColorValue) document.body.style.setProperty('--background-color', this.backgroundColorValue.toString());
		document.body.style.setProperty('color', this.value == ColorScheme.light ? '#000' : '#fff')
		document.body.style.setProperty('--background-color', this.value == ColorScheme.light ? '#fff' : '#000')

		this.action('value', PrefersColorSchemeValue)
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




	public useOnlyColorMode(value?: ColorScheme): this { setPrefersPriorityColorScheme(value); this.mode = value; this.mainHandler(); return this }
	constructor() {
		super();
		this.value = PrefersColorSchemeValue;
		PrefersColorSchemeCSSMedia.addEventListener('change',()=>this.mainHandler())
	}
}

export const PageDataColorMode = new PageDataColorModeClass;

