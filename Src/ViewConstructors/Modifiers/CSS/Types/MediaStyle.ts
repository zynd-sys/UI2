import type { MediaFit } from "../../../Enum/MediaFit";
import type { FitPositionStyle } from "../../CollectableStyles/FitPosition";
import type { MinimalStylesInterface } from "./MinimalStylesType";
import type { Direction } from "../../../Enum/Direction";
import type { Units } from "../../../Enum/Units";




export interface MediaStyleInterface extends MinimalStylesInterface {
	'object-fit'?: MediaFit
	'object-position'?: FitPositionStyle
}

export interface MediaInterface {
	mediaFit(value: MediaFit): this
	mediaPosition(direction: Direction.horizontal | Direction.vertical, value: number, unit?: Units): this
}