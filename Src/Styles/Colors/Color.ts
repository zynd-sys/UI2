import { Environments } from "../../Environment"
import { ColorScheme } from "./PrefersColorSchemeCSSMedia"




export abstract class Color {
	public abstract readonly colorLight: string
	public abstract colorDark?: string
	public abstract darkModeColor(...p: any[]): this
	public toString(): string { return Environments.colorScheme == ColorScheme.dark && this.colorDark ? this.colorDark : this.colorLight }
}