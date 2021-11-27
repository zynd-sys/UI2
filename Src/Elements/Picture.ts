import type { ImageMimeType } from "../ViewConstructors/Enum/ImageMimeType"
import type { ElementAttribute } from "../ViewConstructors/Styles/Attributes"
import type { Listeners, ListenersInterface } from "../ViewConstructors/Styles/Listeners/Listeners"
import type { MediaFit } from "../ViewConstructors/Enum/MediaFit"
import { ViewModifiers } from "../ViewConstructors/ViewModifiers"
import { Units } from "../ViewConstructors/Enum/Units"
import { Direction } from "../ViewConstructors/Enum/Direction"
import { FitPositionStyle } from "../ViewConstructors/Styles/CollectableStyles/FitPosition"
import { StylesInterface, Styles } from "../ViewConstructors/Styles/Styles"







export interface PictureStyleInterface extends StylesInterface {
	'--overlay-color'?: string
	'--object-fit'?: MediaFit
	'--object-position'?: FitPositionStyle
}

export interface MediaInterface {
	mediaFit(value: MediaFit): this
	mediaPosition(direction: Direction.horizontal | Direction.vertical, value: number, unit?: Units): this
}








export class PictureView extends ViewModifiers<{ parent: HTMLPictureElement, image: HTMLImageElement, sources?: Map<ImageMimeType, HTMLSourceElement> }> implements MediaInterface {

	protected HTMLElement?: { parent: HTMLPictureElement, image: HTMLImageElement, sources?: Map<ImageMimeType, HTMLSourceElement> }

	protected styles: Styles<PictureStyleInterface> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLPictureElement>>
	protected attribute?: ElementAttribute<any>

	protected content: string | URL
	protected description: string

	protected sourceMap?: Map<ImageMimeType, string>
	protected get safeSourceMap(): Map<ImageMimeType, string> { return this.sourceMap ? this.sourceMap : this.sourceMap = new Map }




	protected renderSourceMap(picture: HTMLPictureElement, sourcesElements: Map<ImageMimeType, HTMLSourceElement>, sourceData: Map<ImageMimeType, string>) {
		if (sourcesElements.size == 0) sourceData.forEach((data, type) => {
			let element = document.createElement('source');
			picture.prepend(element);
			element.type = type;
			element.srcset = data;
			sourcesElements.set(type, element)
		});


		sourcesElements.forEach((element, type) => {
			if (!sourceData.has(type)) {
				element.remove();
				sourcesElements.delete(type);
				return
			}
			if (element.parentElement != picture) picture.prepend(element);
		});

		sourceData.forEach((data, type) => {
			let element = sourcesElements.get(type);
			if (!element) {
				element = document.createElement('source')
				picture.prepend(element);
				element.type = type;
				sourcesElements.set(type, element)
			}
			if (element.srcset != data) element.srcset = data;
		})
	}



	/**
	 * import: styles, listeners, content, description, stylesImage, sourceArray
	 */
	protected importProperty(view: PictureView): ReturnType<ViewModifiers<any>['importProperty']> {
		super.importProperty(view);
		this.description = view.description;
		this.sourceMap = view.sourceMap;
	}
	protected generateHTMLElement(): { parent: HTMLPictureElement; image: HTMLImageElement; sources?: Map<ImageMimeType, HTMLSourceElement> } {
		let pictureElement = document.createElement('picture');
		let imageElement = pictureElement.appendChild(document.createElement('img'));
		imageElement.alt = this.description;
		imageElement.src = this.content.toString();
		imageElement.loading = 'lazy';
		imageElement.decoding = 'async';

		let element: { parent: HTMLPictureElement; image: HTMLImageElement; sources?: Map<ImageMimeType, HTMLSourceElement> } = { parent: pictureElement, image: imageElement }
		if (this.sourceMap) this.renderSourceMap(pictureElement, element.sources = new Map, this.sourceMap)

		return element
	}
	protected merge(newRender: PictureView, element: { parent: HTMLPictureElement; image: HTMLImageElement; sources?: Map<ImageMimeType, HTMLSourceElement> | undefined }): void {
		if (this.description != newRender.description) { this.description = newRender.description; element.image.alt = this.description; }
		if (this.content != newRender.content) { this.content = newRender.content; element.image.src = this.content.toString(); }

		if (this.sourceMap) this.renderSourceMap(element.parent, element.sources ? element.sources : element.sources = new Map, this.sourceMap)
	}








	public destroy(withAnimation?: boolean): Promise<void> | void {
		// if (withAnimation && this.sourceMap) return super.destroy(withAnimation).then(() => {
		// 	// this.sourceMap?.elements?.forEach(e=>e.remove())
		// 	this.sourceMap = undefined;
		// });
		// this.sourceMap?.elements?.forEach(e=>e.remove())
		this.sourceMap = undefined;
		return super.destroy(withAnimation)
	}





	// float
	// shape-outside
	// clip-path
	public overlayColor(value: string): this { this.styles.set('--overlay-color', value); return this }
	public mediaFit(value: MediaFit): this { this.styles.set('--object-fit', value); return this }
	public mediaPosition(direction: Direction.horizontal | Direction.vertical, value: number, unit: Units = Units.absolute): this {
		if (direction == Direction.horizontal) this.styles.getCollectableStyles('--object-position', FitPositionStyle).x = value + unit;
		else this.styles.getCollectableStyles('--object-position', FitPositionStyle).y = value + unit;
		return this
	}
	public imageSources(imageMimeType: ImageMimeType): (...elements: { src: string | URL, size?: number }[]) => this {
		return (...elements) => {
			this.safeSourceMap.set(
				imageMimeType,
				elements.reduce((v1, v2) => v1 + ',' + v2.src + ' ' + (v2.size ? v2.size.toString() : ''), '').replace(/^\,/, '')
			)
			return this
		}
	}


	constructor(src: string | URL, description: string) {
		super();
		this.content = src;
		this.description = description;
	}
}

export function Picture(src: string | URL, description: string): PictureView { return new PictureView(src, description) }