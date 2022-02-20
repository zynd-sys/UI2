import type { ContentAlign } from "../../../Enum/ContentAlign";
import type { Direction } from "../../../Enum/Direction";
import type { ScrollSnapType } from "../../../Enum/ScrollSnapType";
import type { CSSLength, MinimalStylesInterface } from "./MinimalStylesType";




export interface ElementsContainerStyles extends MinimalStylesInterface {
	'row-gap'?: CSSLength
	'column-gap'?: CSSLength
	'align-items'?: ContentAlign
	'justify-items'?: ContentAlign
	'align-content'?: ContentAlign
	'justify-content'?: ContentAlign

	'scroll-snap-type'?: 'block' | 'inline' | 'both' | `${'block' | 'inline' | 'both'} ${ScrollSnapType}`
	'scroll-padding-block-start'?: CSSLength
	'scroll-padding-inline-start'?: CSSLength
	'scroll-padding-block-end'?: CSSLength
	'scroll-padding-inline-end'?: CSSLength

	'grid-template-columns'?: `repeat(${number},${string})` | string
	'grid-template-rows'?: `repeat(${number},${string})` | string
	'grid-auto-columns'?: string
	'grid-auto-rows'?: string
	'grid-auto-flow'?: `${Direction.horizontal | Direction.vertical}${' dense' | ''}`;

	'flex-wrap'?: 'nowrap' | 'wrap'
	'flex-direction'?: `${Direction}${'-reverse' | ''}`
}