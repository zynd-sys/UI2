import type { ImageMimeType } from "../ViewConstructors/Enum/ImageMimeType"
import type { ElementAttribute } from "../ViewConstructors/Modifiers/Attributes"
import type { Listeners, ListenersInterface } from "../ViewConstructors/Modifiers/Listeners/Listeners"
import type { MinimalStylesInterface } from "../ViewConstructors/Modifiers/CSS/Types/MinimalStylesType"
import type { StylesInterface } from "../ViewConstructors/Modifiers/CSS/Types/StylesInterface"
import type { Color } from "../ViewConstructors/Modifiers/Colors"
import type { MediaInterface } from "../ViewConstructors/Modifiers/CSS/Types/MediaStyle"
import { MediaFit } from "../ViewConstructors/Enum/MediaFit"
import { ViewModifiers } from "../ViewConstructors/ViewModifiers"
import { Units } from "../ViewConstructors/Enum/Units"
import { Direction } from "../ViewConstructors/Enum/Direction"
import { FitPositionStyle } from "../ViewConstructors/Modifiers/CollectableStyles/FitPosition"
import { Styles } from "../ViewConstructors/Modifiers/CSS/Styles"
import { MainStyleSheet } from "../ViewConstructors/Modifiers/CSS/MainStyleSheet"
import { CSSSelectore } from "../ViewConstructors/Modifiers/CSS/CSSSelectore"
import { DefaultColor } from "../ViewConstructors/Modifiers/Colors/DefaultColors"
import { ViewBuilder } from "../ViewConstructors/ViewBuilder"
import { ViewsList } from "../ViewConstructors/Modifiers/ListView"







export interface PictureStyleInterface extends MinimalStylesInterface {
	'--overlay-color'?: Color
	'--object-fit'?: MediaFit
	'--object-position'?: FitPositionStyle
}


// @ts-ignore
interface PictureSelectoreStyle extends StylesInterface {
	'object-fit': 'var(--object-fit)',
	'object-position': 'var(--object-position)'
}







MainStyleSheet.add(
	new CSSSelectore('picture', {
		'display': 'block',
		'overflow': 'hidden',
		'user-select': 'none',
		'-webkit-user-select': 'none',
		'max-inline-size': '100%',
		'inline-size': '100%',
		/* max-block-size: 100%;
		block-size: 100%; */
		'position': 'relative'
	}),
	new CSSSelectore('picture::after, picture img', {
		'display': 'block',
		'position': 'absolute',
		'inset': 0,
		'block-size': '100%',
		'max-inline-size': '100%',
		'inline-size': '100%'
	}),
	new CSSSelectore<PictureStyleInterface>('picture', {
		'--object-fit': MediaFit.cover,
		'--object-position': new FitPositionStyle('50%', '50%'),
		'--overlay-color': DefaultColor.transparent
	}),
	// @ts-ignore
	new CSSSelectore<PictureSelectoreStyle>('picture img', {
		'object-fit': 'var(--object-fit)',
		'object-position': 'var(--object-position)'
	}),

	new CSSSelectore('picture::after', {
		'content': '""',
		'background': 'var(--overlay-color)'
	})
)




class PictureSourceView extends ViewBuilder {

	protected HTMLElement?: HTMLSourceElement

	protected content: ImageMimeType
	protected urls: string

	protected importProperty(newRender: PictureSourceView): void {
		this.content = newRender.content;
		this.urls = newRender.content;
	}



	public render(): HTMLSourceElement {
		if (this.HTMLElement) return this.HTMLElement

		let element = document.createElement('source');
		element.type = this.content;
		element.srcset = this.urls;

		return element
	}


	public update(newRender: PictureSourceView): void {
		if (!this.HTMLElement) { this.importProperty(newRender); return }

		if (this.HTMLElement.type != newRender.content) this.HTMLElement.type = this.content = newRender.content;
		if (this.HTMLElement.srcset != newRender.urls) this.HTMLElement.srcset = this.urls = newRender.urls;
	}


	public destroy(): void {
		if (!this.HTMLElement) return
		this.HTMLElement.remove();
		this.HTMLElement = undefined;
	}


	public getRectElements(): void { }



	constructor(type: ImageMimeType, urls: string) {
		super();
		this.content = type;
		this.urls = urls;
	}
}











export class PictureView extends ViewModifiers<{ parent: HTMLPictureElement, image: HTMLImageElement }> implements MediaInterface {

	protected HTMLElement?: { parent: HTMLPictureElement, image: HTMLImageElement }

	protected styles: Styles<PictureStyleInterface> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLPictureElement>>
	protected attribute?: ElementAttribute<any>

	protected content: string | URL
	protected description: string

	protected sourceList?: ViewsList








	/**
	 * import: styles, listeners, content, description, stylesImage, sourceArray
	 */
	protected override importProperty(view: PictureView): ReturnType<ViewModifiers<any>['importProperty']> {
		super.importProperty(view);
		this.description = view.description;
		this.sourceList = view.sourceList;
	}
	protected generateHTMLElement(): { parent: HTMLPictureElement, image: HTMLImageElement } {
		let pictureElement = document.createElement('picture');
		let imageElement = pictureElement.appendChild(document.createElement('img'));
		imageElement.alt = this.description;
		imageElement.src = this.content.toString();
		imageElement.loading = 'lazy';
		imageElement.decoding = 'async';

		let element: { parent: HTMLPictureElement, image: HTMLImageElement } = { parent: pictureElement, image: imageElement }
		if (this.sourceList) this.sourceList.render(pictureElement)

		return element
	}
	protected merge(newRender: PictureView, element: { parent: HTMLPictureElement, image: HTMLImageElement }): void {
		if (this.description != newRender.description) { this.description = newRender.description; element.image.alt = this.description; }
		if (this.content != newRender.content) { this.content = newRender.content; element.image.src = this.content.toString(); }

		if (this.sourceList) this.sourceList.render(element.parent, false, newRender.sourceList)
	}








	public override destroy(withAnimation?: boolean): Promise<void> | void {
		let result = super.destroy(withAnimation);
		if (result) return result.then(() => {
			this.sourceList?.destroy();
			this.sourceList = undefined;
		})
		this.sourceList?.destroy();
		this.sourceList = undefined;
	}





	// float
	// shape-outside
	public overlayColor(value: string): this { this.styles.set('--overlay-color', value as unknown as Color); return this }
	public mediaFit(value: MediaFit): this { this.styles.set('--object-fit', value); return this }
	public mediaPosition(direction: Direction.horizontal | Direction.vertical, value: number, unit: Units = Units.absolute): this {
		if (direction == Direction.horizontal) this.styles.getCollectableStyles('--object-position', FitPositionStyle).x = `${value}${unit}`;
		else this.styles.getCollectableStyles('--object-position', FitPositionStyle).y = `${value}${unit}`;
		return this
	}
	public imageSources(values: Map<ImageMimeType, { src: string | URL, size?: number }[]>): this {
		let elements: PictureSourceView[] = []
		values.forEach((item, type) => elements.push(new PictureSourceView(type, item.reduce((v1, v2) => `${v1},${v2.src} ${v2.size || ''}`, ''))));

		if (this.sourceList) this.sourceList.replace(elements)
		else this.sourceList = new ViewsList(elements);
		return this
	}


	constructor(src: string | URL, description: string) {
		super();
		this.content = src;
		this.description = description;
	}
}

export function Picture(src: string | URL, description: string): PictureView { return new PictureView(src, description) }