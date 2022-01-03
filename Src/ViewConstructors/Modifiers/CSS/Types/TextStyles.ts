import type { Align } from "../../../Enum/Align";
import type { BorderStyle } from "../../../Enum/BorderStyle";
import type { ColumnInsideBreak } from "../../../Enum/ColumnInsideBreak";
import type { TextSpacing } from "../../../Enum/TextSpacing";
import type { TextTransform } from "../../../Enum/TextTransform";
import type { TextWeight } from "../../../Enum/TextWeight";
import type { Color } from "../../Colors/Colors";
import type { MinimalStylesInterface } from "./MinimalStylesType";





export interface TextStyles extends MinimalStylesInterface {
	'text-align'?: Align
	'tab-size'?: number
	// 'text-transform':
	'text-indent'?: string
	'text-align-last'?: Align
	'font-family'?: string
	'color'?: Color
	'font-size'?: string
	'text-decoration'?: 'line-through' | 'underline'
	'font-weight'?: TextWeight
	'font-style'?: 'italic' | 'normal'
	'white-space'?: TextSpacing
	'letter-spacing'?: string
	'text-transform'?: TextTransform
	'line-height'?: string
	'column-count'?: number
	'column-width'?: string
	'column-rule-width'?: string
	'column-rule-style'?: BorderStyle
	'column-rule-color'?: Color
	'column-gap'?: string
	'column-fill'?: 'auto' | 'balance'
	'break-inside'?: ColumnInsideBreak
	// 'word-break'?: 'normal' | 'break-all' | 'keep-all'
	'overflow-wrap'?: 'normal' | 'anywhere' | 'break-word'
	'text-overflow'?: 'clip' | 'ellipsis'
	'hyphens'?: 'none' | 'manual' | 'auto'
	'-webkit-hyphens'?: 'none' | 'manual' | 'auto'
	'-webkit-line-clamp'?: number
	'dispaly'?: '-webkit-box'
	'-webkit-box-orient'?: 'vertical'
}