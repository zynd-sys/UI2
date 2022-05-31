


export enum ColorScheme {
	light,
	dark
}

let priorityColorScheme: undefined | ColorScheme = undefined;



export function setPrefersPriorityColorScheme(value?: ColorScheme): void {
	if (value) {
		PrefersColorSchemeValue = value;
		priorityColorScheme = value;
	} else {
		priorityColorScheme = undefined;
		PrefersColorSchemeValue = PrefersColorSchemeCSSMedia.matches ? ColorScheme.light : ColorScheme.dark
	}
}





export const PrefersColorSchemeCSSMedia = window.matchMedia('(prefers-color-scheme: light)');
PrefersColorSchemeCSSMedia.addEventListener('change', event => {
	if (!priorityColorScheme) PrefersColorSchemeValue = event.matches ? ColorScheme.light : ColorScheme.dark;
});





export let PrefersColorSchemeValue: ColorScheme = PrefersColorSchemeCSSMedia.matches ? ColorScheme.light : ColorScheme.dark;



