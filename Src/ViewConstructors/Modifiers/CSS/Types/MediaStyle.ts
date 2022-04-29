import type { MediaFit } from '../../../Enum/MediaFit';
import type { FitPositionStyle } from '../../CollectableStyles/FitPosition';
import type { CSSVariable, MinimalStylesInterface } from './MinimalStylesType';




export interface MediaStyleInterface extends MinimalStylesInterface {
	'object-fit'?: MediaFit | CSSVariable<MediaFit>
	'object-position'?: FitPositionStyle | CSSVariable<string>
}
