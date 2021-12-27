import type { MediaFit } from "../ViewConstructors/Enum/MediaFit";
import type { ElementAttribute, ElementAttributeInterface } from "../ViewConstructors/Modifiers/Attributes";
import type { Listeners, ListenersInterface } from "../ViewConstructors/Modifiers/Listeners/Listeners";
import type { MediaInterface } from "./Picture";
import { Units } from "../ViewConstructors/Enum/Units";
import { Styles, StylesInterface } from "../ViewConstructors/Modifiers/Styles";
import { ViewModifiers } from "../ViewConstructors/ViewModifiers";
import { FitPositionStyle } from "../ViewConstructors/Modifiers/CollectableStyles/FitPosition";
import { Direction } from "../ViewConstructors/Enum/Direction";









export interface ViedeoStyleInterface extends StylesInterface {
	'object-fit'?: MediaFit
	'object-position'?: FitPositionStyle
}












export class BackgroundVideoView extends ViewModifiers<HTMLVideoElement> implements MediaInterface {

	protected HTMLElement?: HTMLVideoElement
	protected styles: Styles<ViedeoStyleInterface> = new Styles
	protected listeners?: Listeners<ListenersInterface<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>

	protected content: string | URL
	protected loop: boolean = true


	protected poster?: string | URL
	protected sourceMap?: {
		elements?: HTMLSourceElement[]
		data: Map<string, { mimeType: string, mediaQuery?: string }>
	}


	protected override importProperty(view: BackgroundVideoView): ReturnType<ViewModifiers<any>['importProperty']> {
		super.importProperty(view);
		this.loop = view.loop;
		this.poster = view.poster;
		this.sourceMap = view.sourceMap;
	}




	protected renderSourceMap(picture: HTMLPictureElement, sourceMap?: BackgroundVideoView['sourceMap']) {
		if (sourceMap) {
			if (!this.sourceMap) this.sourceMap = sourceMap;
			else this.sourceMap.data = sourceMap.data
		} else {
			if (this.sourceMap) this.sourceMap.elements?.forEach(e => e.remove())
			this.sourceMap = undefined;
			return
		}
		if (!this.sourceMap) return


		let elements = this.sourceMap.elements;
		if (!elements) elements = this.sourceMap.elements = [];

		if (elements.length != this.sourceMap.data.size) {
			if (elements.length > this.sourceMap.data.size) {
				for (let i = this.sourceMap.data.size; i < elements.length; i++) elements[i]?.remove();
				elements.length = this.sourceMap.data.size;
			} else for (let i = elements.length; i < this.sourceMap.data.size; i++) {
				elements[i] = picture.appendChild(document.createElement('source'))
			};
		}

		let i = 0;
		this.sourceMap.data.forEach((options, src) => {
			let e = (elements as HTMLSourceElement[])[i++]
			if (!e) throw new Error('source map error')
			if (e.src != src) e.src = src;
			if (e.type != options.mimeType) e.type = options.mimeType;
			if (options.mediaQuery && e.media != options.mediaQuery) e.media = options.mediaQuery;
		})

		if (this.sourceMap) {
			if (this.sourceMap.elements) this.sourceMap.elements.forEach(e => e.remove());
			this.sourceMap = undefined;
		}
	}







	protected merge(newRender: BackgroundVideoView, element: HTMLVideoElement): void {
		if (newRender.poster && this.poster?.toString() != newRender.poster.toString()) { this.poster = newRender.poster; element.poster = this.poster.toString(); }
		if (this.content.toString() != newRender.content.toString()) { this.content = newRender.content; element.src = this.content.toString(); }
		this.loop = newRender.loop;
		if (this.loop) element.loop = true;

		this.renderSourceMap(element, newRender.sourceMap);
	}
	protected generateHTMLElement(): HTMLVideoElement {
		let e = this.HTMLElement = document.createElement('video');
		e.src = this.content.toString();
		if (this.loop) e.loop = true;
		if (this.poster) e.poster = this.poster.toString();
		e.autoplay = true;
		e.controls = false;
		e.muted = true;
		e.playsInline = true
		e.disablePictureInPicture = true;
		e.disableRemotePlayback = true;

		return e
	}


	public unInfinity(value: boolean = true): this { this.loop = !value; return this }
	public videoSource(...elements: { src: string, mimeType: string, mediaQuery?: string }[]): this {
		let m: { elements?: HTMLSourceElement[], data: Map<string, { mimeType: string, mediaQuery?: string, element?: HTMLSourceElement }> } | undefined;
		if (this.sourceMap) m = this.sourceMap
		else m = this.sourceMap = { data: new Map }
		let data = m.data;
		elements.forEach(v => data.set(v.src, { mimeType: v.mimeType, mediaQuery: v.mediaQuery }))
		return this
	}
	public mediaFit(value: MediaFit): this { this.styles.set('object-fit', value); return this }
	public mediaPosition(direction: Direction.horizontal | Direction.vertical, value: number, unit: Units = Units.absolute): this {
		if (direction == Direction.horizontal) this.styles.getCollectableStyles('object-position', FitPositionStyle).x = value + unit;
		else this.styles.getCollectableStyles('object-position', FitPositionStyle).y = value + unit;
		return this
	}



	constructor(src: string | URL, poster?: string | URL) {
		super();
		this.content = src;
		if (poster) this.poster = poster
	}
}


export function BackgroundVideo(src: string | URL, poster?: string): BackgroundVideoView { return new BackgroundVideoView(src, poster) }