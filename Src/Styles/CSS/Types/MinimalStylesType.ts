import type { Color } from '../../Colors';
import type { Units } from '../Enums/Units';
import type { BorderStyle } from '../Enums/BorderStyle';
import type { ContentAlign } from '../Enums/ContentAlign';
import type { BlendMode } from '../Enums/BlendMode';
import type { Scroll } from '../Enums/Scroll';
import type { TransformsStyle } from '../CollectableStyles/TransformsStyle';
import type { FiltersStyle } from '../CollectableStyles/FiltersStyle';
import type { DropShadowStyle, InnerShadowStyle } from '../CollectableStyles/ShadowStyle';
import type { Align } from '../Enums/Align';
import type { TimingFunction } from '../Enums/TimingFunction';
import type { CSSStepTimingFunction, CSSStepTimingFunctionType } from '../CollectableStyles/CSSStepTimingFunction';
import type { CSSCubicBezier, CSSCubicBezierType } from '../CollectableStyles/CSSCubicBezier';





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
	`${'col' | 'row' | 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'ew' | 'ns' | 'nesw' | 'nwse'}-resize` |
	`zoom-${'in' | 'out'}`;






export type CSSVariable<V extends string | number | boolean> = `var(--${string})` | `var(--${string},${V})`
export type CSSTime = 0 | `${number}${'s' | 'ms'}`
export type CSSLength = 0 | `${number}${Units}`
export type CSSAngle = 0 | `${number}${'deg' | 'grad' | 'rad' | 'turn'}`



export interface MinimalStylesInterface {

	'inline-size'?: CSSLength | `${'max' | 'min' | 'fit'}-content`
	'max-inline-size'?: CSSLength
	'min-inline-size'?: CSSLength

	'block-size'?: CSSLength | `${'max' | 'min' | 'fit'}-content`
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

	'clip-path'?: string
	'mix-blend-mode'?: BlendMode
	'isolation'?: 'isolate' | 'auto'
	'aspect-ratio'?: `${number}/${number}`
	'flex-grow'?: number
	'overflow-y'?: Scroll
	'overflow-x'?: Scroll

	'position'?: 'sticky' | 'relative' | 'static' | 'absolute' | 'fixed'
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

	'box-shadow'?: InnerShadowStyle | DropShadowStyle | 'none'

	'scroll-snap-align'?: Align
	'scroll-behavior'?: 'auto' | 'smooth'
	'background-color'?: Color



	'user-select'?: 'none' | 'auto' | 'inherit'
	'-webkit-user-select'?: 'none' | 'auto' | 'inherit'
	'touch-action'?: 'auto' | 'none' | 'manipulation' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom'


	'transition-property'?: 'all' | string
	'transition-duration'?: CSSTime
	'transition-delay'?: CSSTime
	'transition-timing-function'?: TimingFunction | CSSCubicBezierType | CSSStepTimingFunctionType | CSSCubicBezier | CSSStepTimingFunction


	'appearance'?: '-apple-pay-button' | 'none'
	'-moz-appearance'?: 'none'
	'-webkit-appearance'?: '-apple-pay-button' | 'none' | 'textfield'

	'cursor'?: cursorType

	'z-index'?: number
}