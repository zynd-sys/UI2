import { Direction } from "./Enum/Direction";
import { ImageMimeType } from "./Enum/ImageMimeType";
import { MediaFit } from "./Enum/MediaFit";
import { Units } from "./Enum/Units";
import { FitPositionStyle } from "./Modifiers/CollectableStyles/FitPosition";
import { Styles } from "./Modifiers/CSS/Styles";
import { MinimalStylesInterface } from "./Modifiers/CSS/Types/MinimalStylesType";
import { ViewsList } from "./Modifiers/ListView";
import { ViewBuilder } from "./ViewBuilder";
import { ViewModifiers } from "./ViewModifiers";







class MediaSourceView extends ViewBuilder {

	protected HTMLElement?: HTMLSourceElement

	protected content: string
	protected urls: string

	protected importProperty(newRender: MediaSourceView): void {
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


	public update(newRender: MediaSourceView): void {
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



	constructor(type: string, urls: string) {
		super();
		this.content = type;
		this.urls = urls;
	}
}












export interface MediaStyleInterface extends MinimalStylesInterface {
	'--object-fit'?: MediaFit
	'--object-position'?: FitPositionStyle
	'object-fit'?: MediaFit
	'object-position'?: FitPositionStyle
}





export abstract class ViewMediaElement<E extends HTMLElement | { parent: HTMLElement; }, S extends ImageMimeType | string> extends ViewModifiers<E> {

	protected abstract override styles: Styles<MediaStyleInterface>

	protected sourceList?: ViewsList
	protected abstract useCSSVariablesForMediaStyles?: boolean


	protected override importProperty(view: ViewMediaElement<any, any>): ReturnType<ViewModifiers<any>['importProperty']> {
		this.sourceList = view.sourceList;
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
		values.forEach((item, type) => elements.push(new MediaSourceView(type, item.reduce((v1, v2) => `${v1},${v2.src} ${v2.size || ''}`, ''))));

		if (this.sourceList) this.sourceList.replace(elements)
		else this.sourceList = new ViewsList(elements);
		return this
	}








	public override update(newRender: ViewMediaElement<any, any>): void {
		if (this.HTMLElement) {
			let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;

			if (newRender.sourceList) {
				if (this.sourceList) this.sourceList.render(element, false, newRender.sourceList)
				else { this.sourceList = newRender.sourceList; this.sourceList.render(element) }
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
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;
		this.renderModifiers(element, undefined, withAnimation);
		this.sourceList?.render(element);
		return element
	}

	public override destroy(withAnimation: boolean = false): Promise<void> | void {
		if (this.sourceList) { this.sourceList.destroy(); this.sourceList = undefined }
		return super.destroy(withAnimation)
	}
}