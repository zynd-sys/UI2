import type { Align } from "../Enum/Align";
import { BorderStyle } from "../Enum/BorderStyle";
import type { ContentAlign } from "../Enum/ContentAlign";
import type { Scroll } from "../Enum/Scroll";
import type { TimingFunction } from "../Enum/TimingFunction";
import type { CubicBezier } from "./Animation/CubicBezier";
import type { FiltersStyle } from "./CollectableStyles/FiltersStyle";
import type { InnerShadowStyle } from "./CollectableStyles/ShadowStyle";
import type { TransformsStyle } from "./CollectableStyles/TransformsStyle";
import type { Color } from "./Colors/Colors";


export type cursorType = 'auto' |
	'default' |
	'context-menu' |
	'help' |
	'pointer' |
	'progress' |
	'cell' |
	'crosshair' |
	'text' |
	'vertical-text' |
	'alias' |
	'copy' |
	'move' |
	'no-drop' |
	'not-allowed' |
	'grab' |
	'grabbing' |
	'all-scroll' |
	'col-resize' |
	'row-resize' |
	'n-resize' |
	'e-resize' |
	's-resize' |
	'w-resize' |
	'ne-resize' |
	'nw-resize' |
	'se-resize' |
	'sw-resize' |
	'ew-resize' |
	'ns-resize' |
	'nesw-resize' |
	'nwse-resize' |
	'zoom-in' |
	'zoom-out';




export interface StylesInterface {
	// [key: string]: string | number | InnerShadowStyle | undefined

	'width'?: string
	'max-width'?: string
	'min-width'?: string

	'height'?: string
	'max-height'?: string
	'min-height'?: string

	'padding-top'?: string
	'padding-right'?: string
	'padding-bottom'?: string
	'padding-left'?: string

	'margin-top'?: string
	'margin-right'?: string
	'margin-bottom'?: string
	'margin-left'?: string

	'outline-width'?: string
	'outline-color'?: Color
	'outline-style'?: BorderStyle

	'border-top-width'?: string
	'border-right-width'?: string
	'border-bottom-width'?: string
	'border-left-width'?: string
	'border-top-left-radius'?: string
	'border-top-right-radius'?: string
	'border-bottom-right-radius'?: string
	'border-bottom-left-radius'?: string
	'border-color'?: Color
	'border-style'?: BorderStyle

	'grid-column-start': string | number
	'grid-column-end': string | number
	'grid-row-start': string | number
	'grid-row-end': string | number

	'justify-self'?: ContentAlign
	'align-self'?: ContentAlign
	'order'?: number

	'flex-grow'?: number
	'overflow-y'?: Scroll
	'overflow-x'?: Scroll

	'position'?: 'sticky' | 'relative' | 'static'
	'left'?: string
	'right'?: string
	'top'?: string
	'bottom'?: string

	'opacity': number
	'transform'?: TransformsStyle
	'filter'?: FiltersStyle
	'transform-origin'?: string
	'perspective'?: string
	'backdrop-filter'?: FiltersStyle
	'-webkit-backdrop-filter'?: FiltersStyle

	'box-shadow'?: InnerShadowStyle

	'scroll-snap-align'?: Align
	'scroll-behavior': 'auto' | 'smooth'
	'background-color'?: Color



	'user-select'?: 'none' | 'auto'
	'-webkit-user-select'?: 'none' | 'auto'


	'transition-property'?: 'all'
	'transition-duration'?: string
	'transition-delay'?: string
	'transition-timing-function'?: TimingFunction | CubicBezier



	'cursor'?: cursorType

	'z-index'?: number
}








export class Styles<I extends StylesInterface> extends Map<keyof I, I[keyof I]> {

	public getCollectableStyles<P extends keyof I, C extends NonNullable<I[P]>, A extends any[]>(key: P, constructor: new (...p: A) => C, ...constructorParameters: A): C {
		let v = this.get(key);
		if (!v) this.set(key, v = new constructor(...constructorParameters))
		return v as C
	}

	public render(element: HTMLElement): this {
		const styles = element.style
		if (styles.length == 0) { this.forEach((value, key) => styles.setProperty(key as string, String(value))); return this }

		for (let i = 0; i < styles.length; i++) {
			let styleProperty = element.style.item(i);
			if (!this.has(styleProperty as any)) { styles.removeProperty(styleProperty); i-- }
		}
		this.forEach((value, key) => {
			let v = String(value);
			if (styles.getPropertyValue(key as any) != v) styles.setProperty(key as string, v)
		})
		return this
	}
}
export interface Styles<I extends StylesInterface> {
	get<P extends keyof I>(key: P): I[P] | undefined
	set<P extends keyof I>(key: P, value: NonNullable<I[P]>): this
}