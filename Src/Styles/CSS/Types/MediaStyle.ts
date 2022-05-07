import type { FitPositionCSSType, FitPositionStyle } from '../CollectableStyles/FitPosition';
import type { MediaFit } from '../Enums/MediaFit';
import type { CSSVariable, MinimalStylesInterface } from './MinimalStylesType';




export interface MediaStyleInterface extends MinimalStylesInterface {
	'--object-fit'?: MediaFit
	'--object-position'?: FitPositionStyle | FitPositionCSSType | CSSVariable<string>

	'object-fit'?: MediaFit | CSSVariable<MediaFit>
	'object-position'?: FitPositionStyle | FitPositionCSSType | CSSVariable<string>
}
