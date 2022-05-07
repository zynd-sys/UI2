import type { Color } from '../../Colors';
import type { StrokeLinecap } from '../Enums/StrokeLinecap';
import type { StrokeLinejoin } from '../Enums/StrokeLinejoin';
import type { MinimalStylesInterface } from './MinimalStylesType';



export interface ShapeStyles extends MinimalStylesInterface {
	'--fill'?: Color
	'--fill-opacity'?: number
	'--fill-rule'?: 'nonzero' | 'evenodd'
	'--stroke-color'?: Color
	'--stroke-width'?: number
	'--stroke-dasharray'?: string
	'--stroke-dashoffset'?: number
	'--stroke-linecap'?: StrokeLinecap
	'--stroke-linejoin'?: StrokeLinejoin
	'--stroke-miterlimit'?: number
	'--stroke-opacity'?: number


}

export interface ShapeSVGElementStyles extends MinimalStylesInterface {
	'fill'?: 'var(--fill)'
	'fill-opacity'?: 'var(--fill-opacity)'
	'fill-rule'?: 'var(--fill-rule)'
	'stroke-color'?: 'var(--stroke-color)'
	'stroke-width'?: 'var(--stroke-width)'
	'stroke-dasharray'?: 'var(--stroke-dasharray)'
	'stroke-dashoffset'?: 'var(--stroke-dashoffset)'
	'stroke-linecap'?: 'var(--stroke-linecap)'
	'stroke-linejoin'?: 'var(--stroke-linejoin)'
	'stroke-miterlimit'?: 'var(--stroke-miterlimit)'
	'stroke-opacity'?: 'var(--stroke-opacity)'
	'transition'?: 'inherit'
}