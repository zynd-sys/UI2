import type { Align } from "../../../Enum/Align";
import type { BorderStyle } from "../../../Enum/BorderStyle";
import type { ContentAlign } from "../../../Enum/ContentAlign";
import type { Scroll } from "../../../Enum/Scroll";
import type { TimingFunction } from "../../../Enum/TimingFunction";
import type { CubicBezier } from "../../Animation/CubicBezier";
import type { FiltersStyle } from "../../CollectableStyles/FiltersStyle";
import type { InnerShadowStyle } from "../../CollectableStyles/ShadowStyle";
import type { TransformsStyle } from "../../CollectableStyles/TransformsStyle";
import type { Color } from "../../Colors/Colors";





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




export interface MinimalStylesInterface {

	'inline-size'?: string
	'max-inline-size'?: string
	'min-inline-size'?: string

	'block-size'?: string
	'max-block-size'?: string
	'min-block-size'?: string

	'padding-block-start'?: string
	'padding-inline-start'?: string
	'padding-block-end'?: string
	'padding-inline-end'?: string

	'margin-block-start'?: string
	'margin-inline-start'?: string
	'margin-block-end'?: string
	'margin-inline-end'?: string

	'outline-width'?: string
	'outline-offset'?: string
	'outline-color'?: Color
	'outline-style'?: BorderStyle

	'border-block-start-width'?: string
	'border-inline-start-width'?: string
	'border-block-end-width'?: string
	'border-inline-end-width'?: string
	'border-block-start-color'?: Color
	'border-inline-start-color'?: Color
	'border-block-end-color'?: Color
	'border-inline-end-color'?: Color
	'border-block-start-style'?: BorderStyle
	'border-inline-start-style'?: BorderStyle
	'border-block-end-style'?: BorderStyle
	'border-inline-end-style'?: BorderStyle

	'border-start-start-radius'?: string
	'border-start-end-radius'?: string
	'border-end-end-radius'?: string
	'border-end-start-radius'?: string


	'grid-column-start'?: string | number
	'grid-column-end'?: string | number
	'grid-row-start'?: string | number
	'grid-row-end'?: string | number

	'justify-self'?: ContentAlign
	'align-self'?: ContentAlign
	'order'?: number

	'flex-grow'?: number
	'overflow-y'?: Scroll
	'overflow-x'?: Scroll

	'position'?: 'sticky' | 'relative' | 'static'
	'inset-block-start'?: string
	'inset-inline-start'?: string
	'inset-block-end'?: string
	'inset-inline-end'?: string


	'opacity'?: number
	'transform'?: TransformsStyle
	'filter'?: FiltersStyle
	'transform-origin'?: string
	'perspective'?: string
	'backdrop-filter'?: FiltersStyle
	'-webkit-backdrop-filter'?: FiltersStyle

	'box-shadow'?: InnerShadowStyle

	'scroll-snap-align'?: Align
	'scroll-behavior'?: 'auto' | 'smooth'
	'background-color'?: Color



	'user-select'?: 'none' | 'auto'
	'-webkit-user-select'?: 'none' | 'auto'
	'touch-action'?: 'auto' | 'none' | 'manipulation' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom'


	'transition-property'?: 'all'
	'transition-duration'?: string
	'transition-delay'?: string
	'transition-timing-function'?: TimingFunction | CubicBezier



	'cursor'?: cursorType

	'z-index'?: number
}
