import type { Align } from "../../../Enum/Align";
import type { BorderStyle } from "../../../Enum/BorderStyle";
import type { ContentAlign } from "../../../Enum/ContentAlign";
import type { Scroll } from "../../../Enum/Scroll";
import type { TimingFunction } from "../../../Enum/TimingFunction";
import type { CubicBezier } from "../../Animation/CubicBezier";
import type { FiltersStyle } from "../../CollectableStyles/FiltersStyle";
import type { DropShadowStyle, InnerShadowStyle } from "../../CollectableStyles/ShadowStyle";
import type { TransformsStyle } from "../../CollectableStyles/TransformsStyle";
import type { Color } from "../../Colors/Colors";
import type { Units } from "../../../Enum/Units";





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


export type CSSTime = `${number}${'s' | 'ms'}`
export type CSSLength = 0 | `${number}${Units}`

export interface MinimalStylesInterface {

	'inline-size'?: CSSLength
	'max-inline-size'?: CSSLength
	'min-inline-size'?: CSSLength

	'block-size'?: CSSLength
	'max-block-size'?: CSSLength
	'min-block-size'?: CSSLength

	'padding-block-start'?: CSSLength
	'padding-inline-start'?: CSSLength
	'padding-block-end'?: CSSLength
	'padding-inline-end'?: CSSLength

	'margin-block-start'?: CSSLength
	'margin-inline-start'?: CSSLength
	'margin-block-end'?: CSSLength
	'margin-inline-end'?: CSSLength

	'outline-width'?: CSSLength
	'outline-offset'?: CSSLength
	'outline-color'?: Color
	'outline-style'?: BorderStyle

	'border-block-start-width'?: CSSLength
	'border-inline-start-width'?: CSSLength
	'border-block-end-width'?: CSSLength
	'border-inline-end-width'?: CSSLength
	'border-block-start-color'?: Color
	'border-inline-start-color'?: Color
	'border-block-end-color'?: Color
	'border-inline-end-color'?: Color
	'border-block-start-style'?: BorderStyle
	'border-inline-start-style'?: BorderStyle
	'border-block-end-style'?: BorderStyle
	'border-inline-end-style'?: BorderStyle

	'border-start-start-radius'?: CSSLength
	'border-start-end-radius'?: CSSLength
	'border-end-end-radius'?: CSSLength
	'border-end-start-radius'?: CSSLength


	'grid-column-start'?: number | `span ${number}`
	'grid-column-end'?: number | `span ${number}`
	'grid-row-start'?: number | `span ${number}`
	'grid-row-end'?: number | `span ${number}`

	'justify-self'?: ContentAlign
	'align-self'?: ContentAlign
	'order'?: number

	'flex-grow'?: number
	'overflow-y'?: Scroll
	'overflow-x'?: Scroll

	'position'?: 'sticky' | 'relative' | 'static' | 'absolute'
	'inset-block-start'?: CSSLength
	'inset-inline-start'?: CSSLength
	'inset-block-end'?: CSSLength
	'inset-inline-end'?: CSSLength


	'opacity'?: number
	'transform'?: TransformsStyle
	'filter'?: FiltersStyle
	'transform-origin'?: string
	'perspective'?: string
	'backdrop-filter'?: FiltersStyle
	'-webkit-backdrop-filter'?: FiltersStyle

	'box-shadow'?: InnerShadowStyle | DropShadowStyle

	'scroll-snap-align'?: Align
	'scroll-behavior'?: 'auto' | 'smooth'
	'background-color'?: Color



	'user-select'?: 'none' | 'auto' | 'inherit'
	'-webkit-user-select'?: 'none' | 'auto' | 'inherit'
	'touch-action'?: 'auto' | 'none' | 'manipulation' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom'


	'transition-property'?: 'all' | string
	'transition-duration'?: CSSTime
	'transition-delay'?: CSSTime
	'transition-timing-function'?: TimingFunction | CubicBezier


	'appearance'?: '-apple-pay-button' | 'none'
	'-moz-appearance'?: 'none'
	'-webkit-appearance'?: '-apple-pay-button' | 'none'

	'cursor'?: cursorType

	'z-index'?: number
}