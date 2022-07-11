import { ColorScheme } from './ColorScheme';





let priorityColorScheme: undefined | ColorScheme = undefined;


/** for disabled priorityColorScheme set `undefined` */
export function setPrefersPriorityColorScheme(value?: ColorScheme): void {
	if (typeof value != 'undefined') {
		PrefersColorSchemeValue = value;
		priorityColorScheme = value;
	}
	else {
		priorityColorScheme = undefined;
		PrefersColorSchemeValue = PrefersColorSchemeCSSMedia.matches ? ColorScheme.light : ColorScheme.dark
	}
}





export const PrefersColorSchemeCSSMedia = window.matchMedia('(prefers-color-scheme: light)');
PrefersColorSchemeCSSMedia.addEventListener('change', event => {
	if (!priorityColorScheme) PrefersColorSchemeValue = event.matches ? ColorScheme.light : ColorScheme.dark;
});





export let PrefersColorSchemeValue: ColorScheme = PrefersColorSchemeCSSMedia.matches ? ColorScheme.light : ColorScheme.dark;




