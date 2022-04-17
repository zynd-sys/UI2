import type { ImageMimeType } from "./Enum/ImageMimeType";
import type { MediaFit } from "./Enum/MediaFit";
import type { MinimalStylesInterface } from "./Modifiers/CSS/Types/MinimalStylesType";
import type { Styles } from "./Modifiers/CSS/Styles";
import { Direction } from "./Enum/Direction";
import { Units } from "./Enum/Units";
import { FitPositionStyle } from "./Modifiers/CollectableStyles/FitPosition";
import { ViewsList } from "./Modifiers/ListView";
import { ViewBuilder } from "./ViewBuilder";
import { ViewModifiers } from "./ViewModifiers";







class MediaSourceView extends ViewBuilder {

	protected HTMLElement?: HTMLSourceElement

	protected useSrcset: boolean
	protected content: string
	protected url: string

	protected importProperty(newRender: MediaSourceView): void {
		this.content = newRender.content;
		this.url = newRender.content;
	}



	public render(): HTMLSourceElement {
		if (this.HTMLElement) return this.HTMLElement

		let element = document.createElement('source');
		element.type = this.content;

		if (this.useSrcset) element.srcset = this.url;
		else element.src = this.url;

		return element
	}


	public update(newRender: MediaSourceView): void {
		if (!this.HTMLElement) { this.importProperty(newRender); return }

		if (this.HTMLElement.type != newRender.content) this.HTMLElement.type = this.content = newRender.content;

		let target: 'src' | 'srcset';
		let altTarget: 'src' | 'srcset';
		if (this.useSrcset) { target = 'srcset'; altTarget = 'src'; }
		else { target = 'src'; altTarget = 'srcset' }

		if (this.HTMLElement[target] != newRender.url) this.HTMLElement[target] = this.url = newRender.url;
		if (this.HTMLElement[altTarget]) this.HTMLElement[altTarget] = '';
	}


	public destroy(): void {
		if (!this.HTMLElement) return
		this.HTMLElement.remove();
		this.HTMLElement = undefined;
	}


	public getRectElements(): void { }



	constructor(type: string, url: string, useSrcset: boolean = false) {
		super();
		this.content = type;
		this.url = url;
		this.useSrcset = useSrcset;
	}
}












export interface MediaStyleInterface extends MinimalStylesInterface {
	'--object-fit'?: MediaFit
	'--object-position'?: FitPositionStyle
	'object-fit'?: MediaFit
	'object-position'?: FitPositionStyle
}





export abstract class ViewMediaElement<E extends HTMLElement | { parent: HTMLElement; image: HTMLElement }, S extends ImageMimeType | string> extends ViewModifiers<E> {

	protected abstract override styles: Styles<MediaStyleInterface>

	protected sourceList?: ViewsList
	protected abstract useCSSVariablesForMediaStyles?: boolean
	protected abstract useSrcsetSource?: boolean


	protected override importProperty(view: ViewMediaElement<any, any>): ReturnType<ViewModifiers<any>['importProperty']> {
		this.sourceList = view.sourceList;
		this.useCSSVariablesForMediaStyles = view.useCSSVariablesForMediaStyles;
		this.useSrcsetSource = view.useSrcsetSource;
		return super.importProperty(view);
	}





	public mediaFit(value: MediaFit): this { this.styles.set(this.useCSSVariablesForMediaStyles ? '--object-fit' : 'object-fit', value); return this }
	/** @param unit default `Units.absolute` */
	public mediaPosition(direction: Direction.horizontal | Direction.vertical, value: number, unit: Units = Units.absolute): this {
		if (direction == Direction.horizontal) this.styles.getCollectableStyles('--object-position', FitPositionStyle).x = `${value}${unit}`;
		else this.styles.getCollectableStyles(this.useCSSVariablesForMediaStyles ? '--object-position' : 'object-position', FitPositionStyle).y = `${value}${unit}`;
		return this
	}
	public mediaSources(values: Map<S, { src: string | URL, size?: number }[]>): this {
		let elements: MediaSourceView[] = []
		values.forEach((item, type) => elements.push(new MediaSourceView(type, item.reduce((v1, v2) => `${v1},${v2.src} ${v2.size || ''}`, ''), this.useSrcsetSource)));

		if (this.sourceList) this.sourceList.replace(elements)
		else this.sourceList = new ViewsList(elements);
		return this
	}








	public override update(newRender: ViewMediaElement<any, any>): void {
		if (this.HTMLElement) {
			let element: HTMLElement;
			let altElement: undefined | HTMLElement;
			if (this.HTMLElement instanceof HTMLElement) element = this.HTMLElement
			else {
				element = this.HTMLElement.parent;
				altElement = this.HTMLElement.image;
			}

			if (newRender.sourceList) {
				if (this.sourceList) this.sourceList.render(element, false, newRender.sourceList, altElement ? [altElement] : undefined)
				else { this.sourceList = newRender.sourceList; this.sourceList.render(element, false, undefined, altElement ? [altElement] : undefined) }
			} else if (this.sourceList) {
				this.sourceList.destroy();
				this.sourceList = undefined;
			}
		}
		return super.update(newRender)
	}

	public override render(withAnimation: boolean = false): HTMLElement {
		if (this.HTMLElement) return this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent

		this.HTMLElement = this.generateHTMLElement();
		let element: HTMLElement;
		let altElement: undefined | HTMLElement;
		if (this.HTMLElement instanceof HTMLElement) element = this.HTMLElement
		else {
			element = this.HTMLElement.parent;
			altElement = this.HTMLElement.image;
		}

		this.renderModifiers(element, undefined, withAnimation);
		this.sourceList?.render(element, false, undefined, altElement ? [altElement] : undefined);
		return element
	}

	public override destroy(withAnimation: boolean = false): Promise<void> | void {
		if (this.sourceList) { this.sourceList.destroy(); this.sourceList = undefined }
		return super.destroy(withAnimation)
	}
}