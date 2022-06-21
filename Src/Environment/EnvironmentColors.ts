import type { StylesInterface } from '../Styles/CSS/Types';
import type { ColorScheme } from '../Styles/Colors/ColorScheme';
import { Color, DefaultColor } from '../Styles/Colors';
import { PrefersColorSchemeCSSMedia, PrefersColorSchemeValue, setPrefersPriorityColorScheme } from '../Styles/Colors/PrefersColorSchemeCSSMedia';
import { CSSSelectore, MainStyleSheet } from '../Styles/CSS';
import { EnvironmentSizes } from './EnvironmentSizes';






interface PageDataStyles extends StylesInterface {
	'--page-background-color'?: Color
	'--page-text-color'?: Color
}



const rootSelectore = new CSSSelectore<PageDataStyles>(':root', {
	'--page-background-color': DefaultColor.backgroundColor,
	'--page-text-color': DefaultColor.textColor
})

MainStyleSheet.add(
	rootSelectore,
	new CSSSelectore('ui-view > *', {
		'background': 'var(--page-background-color)',
		// @ts-ignore
		'color': 'var(--page-text-color)'
	})
)








export class EnvironmentColors extends EnvironmentSizes {

	/**  @pageEnvironment */
	public get colorScheme(): ColorScheme { return PrefersColorSchemeValue }
	public set colorScheme(value: ColorScheme) {
		setPrefersPriorityColorScheme(value);
		rootSelectore
			.updateObjectValue('--page-background-color')
			.updateObjectValue('--page-text-color')
	}


	/**  @pageEnvironment */
	public get backgroundColor(): Color { return rootSelectore.get('--page-background-color')! }
	public set backgroundColor(value) { rootSelectore.set('--page-background-color', value) }


	/**  @pageEnvironment */
	public get textColor(): Color { return rootSelectore.get('--page-text-color')! }
	public set textColor(value) { rootSelectore.set('--page-text-color', value) }










	constructor() {
		super();

		this
			.addPageEnvironment('backgroundColor' as any, () => this.backgroundColor = DefaultColor.backgroundColor)
			.addPageEnvironment('textColor' as any, () => this.textColor = DefaultColor.textColor)
			.addPageEnvironment('colorScheme' as any, () => setPrefersPriorityColorScheme(undefined))

		PrefersColorSchemeCSSMedia.addEventListener('change', () => {
			rootSelectore
				.updateObjectValue('--page-background-color')
				.updateObjectValue('--page-text-color')

			this.action('colorScheme', PrefersColorSchemeValue)
		});
	}
}

