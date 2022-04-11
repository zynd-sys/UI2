import type { MediaFit } from "../../../Enum/MediaFit";
import type { FitPositionStyle } from "../../CollectableStyles/FitPosition";
import type { MinimalStylesInterface } from "./MinimalStylesType";




export interface MediaStyleInterface extends MinimalStylesInterface {
	'object-fit'?: MediaFit
	'object-position'?: FitPositionStyle
}
