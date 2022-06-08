import type { Color } from '../Styles/Colors';
import { ColorScheme, PrefersColorSchemeCSSMedia, PrefersColorSchemeValue } from '../Styles/Colors/PrefersColorSchemeCSSMedia';
import { EnvironmentSizes } from './EnvironmentSizes';











export class EnvironmentColors extends EnvironmentSizes {

	public colorScheme: ColorScheme

	public backgroundColor?: Color
	public textColor?: Color


	private mainHandlerColors() {
		if (this.textColor) document.body.style.setProperty('color', this.textColor.toString());
		else document.body.style.setProperty('color', this.colorScheme == ColorScheme.light ? '#000' : '#fff')

		if (this.backgroundColor) document.body.style.setProperty('--background-color', this.backgroundColor.toString());
		else document.body.style.setProperty('--background-color', this.colorScheme == ColorScheme.light ? '#fff' : '#000')

		this.action('colorScheme', PrefersColorSchemeValue)
	}







	constructor() {
		super();
		this.colorScheme = PrefersColorSchemeValue;
		PrefersColorSchemeCSSMedia.addEventListener('change', () => this.mainHandlerColors());
	}
}

