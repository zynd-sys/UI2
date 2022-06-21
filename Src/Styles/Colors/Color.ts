import { PrefersColorSchemeValue } from './PrefersColorSchemeCSSMedia'
import { ColorScheme } from './ColorScheme'




export abstract class Color {
	public abstract readonly colorLight: string
	public abstract colorDark?: string
	public abstract darkModeColor(...p: any[]): this
	public toString(): string { return PrefersColorSchemeValue == ColorScheme.dark && this.colorDark ? this.colorDark : this.colorLight }
}