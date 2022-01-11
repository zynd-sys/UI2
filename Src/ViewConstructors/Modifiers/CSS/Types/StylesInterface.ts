import type { SubElementsStyles } from "./SubElementsStyles";
import type { TextStyles } from "./TextStyles";
import type { MediaStyleInterface } from "./MediaStyle";
import type { CSSLength } from "./MinimalStylesType";





export interface StylesInterface extends SubElementsStyles, TextStyles, MediaStyleInterface {
	'content'?: `"${string}"`
	'overscroll-behavior'?: 'auto' | 'contain' | 'none'
	'resize'?: 'none' | 'both' | 'horizontal' | 'vertical' // | 'block' | 'inline'
	'clip'?: string
	'will-change'?: string

	'display'?: 'none' | 'contents' | 'inline' | `${'inline-' | ''}${'block' | 'flex' | 'grid'}`
	'box-sizing'?: `${'border' | 'content'}-box`
	'flex-flow'?: `${'row' | 'column'}${'-reverse' | ''}${' nowrap' | ' wrap' | ' wrap-reverse' | ''}`
	'overflow'?: 'hidden'

	'padding'?: 0
	'margin'?: 0
	'inset'?: 0 | 'auto' | CSSLength | `${CSSLength} ${CSSLength}` | `${CSSLength} ${CSSLength} ${CSSLength} ${CSSLength}`
	'flex-shrink'?: number
	'border-width'?: 0
	'border-radius'?: 0 | 'auto' | CSSLength | `${CSSLength} ${CSSLength}` | `${CSSLength} ${CSSLength} ${CSSLength} ${CSSLength}`

	'background'?: string
	'outline'?: 'none'

	'font'?: string
	'-moz-osx-font-smoothing'?: string
}