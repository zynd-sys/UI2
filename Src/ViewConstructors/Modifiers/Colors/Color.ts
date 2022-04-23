import { ColorMode, PageDataColorMode } from 'Data/PageData/PageDataColorMode';

export abstract class Color {
	public abstract readonly colorLight: string
	public abstract colorDark?: string
	public abstract darkModeColor(...p: any[]): this
	public toString(): string { return PageDataColorMode.value == ColorMode.dark && this.colorDark ? this.colorDark : this.colorLight }
}