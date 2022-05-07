import type { Color } from '../../Colors';
import type { Align } from '../Enums/Align';
import type { BorderStyle } from '../Enums/BorderStyle';
import type { ColumnInsideBreak } from '../Enums/ColumnInsideBreak';
import type { TextSpacing } from '../Enums/TextSpacing';
import type { TextTransform } from '../Enums/TextTransform';
import type { TextWeight } from '../Enums/TextWeight';
import type { CSSLength, MinimalStylesInterface } from './MinimalStylesType';





export interface TextStyles extends MinimalStylesInterface {
	'text-align'?: Align
	'tab-size'?: number | CSSLength
	// 'text-transform':
	'text-indent'?: CSSLength
	'text-align-last'?: Align
	'font-family'?: string
	'color'?: Color | 'inherit'
	'font-size'?: CSSLength
	'text-decoration'?: 'line-through' | 'underline' | 'none'
	'font-weight'?: TextWeight
	'font-style'?: 'italic' | 'normal'
	'white-space'?: TextSpacing
	'letter-spacing'?: CSSLength
	'text-transform'?: TextTransform
	'line-height'?: number | CSSLength
	'column-count'?: number
	'column-width'?: CSSLength
	'column-rule-width'?: CSSLength
	'column-rule-style'?: BorderStyle
	'column-rule-color'?: Color
	'column-gap'?: CSSLength
	'column-fill'?: 'auto' | 'balance'
	'break-inside'?: ColumnInsideBreak
	// 'word-break'?: 'normal' | 'break-all' | 'keep-all'
	'overflow-wrap'?: 'normal' | 'anywhere' | 'break-word'
	'text-overflow'?: 'clip' | 'ellipsis'
	'hyphens'?: 'none' | 'manual' | 'auto'
	'-webkit-hyphens'?: 'none' | 'manual' | 'auto'
	'-webkit-line-clamp'?: number
	'display'?: '-webkit-box' | string
	'vertical-align'?: 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom' | CSSLength
	'-webkit-box-orient'?: 'vertical'
}