import type { ContentAlign } from "../../../Enum/ContentAlign";
import type { Direction } from "../../../Enum/Direction";
import type { MinimalStylesInterface } from "./MinimalStylesType";




export interface SubElementsStyles extends MinimalStylesInterface {
	'row-gap'?: string
	'column-gap'?: string
	'align-items'?: ContentAlign
	'justify-items'?: ContentAlign
	'align-content'?: ContentAlign
	'justify-content'?: ContentAlign

	'scroll-snap-type'?: string
	'scroll-padding-block-start'?: string
	'scroll-padding-inline-start'?: string
	'scroll-padding-block-end'?: string
	'scroll-padding-inline-end'?: string

	'grid-template-columns'?: string
	'grid-template-rows'?: string
	'grid-auto-columns'?: string
	'grid-auto-rows'?: string
	'grid-auto-flow'?: `${Direction.horizontal | Direction.vertical} dense`;

	'flex-wrap'?: 'nowrap' | 'wrap'
	'flex-direction'?: Direction | `${Direction}-reverse`
}