import type { ImageMimeType } from './Enum/ImageMimeType';
import type { Listeners, LoadingResourceListeners, LoadingResourceModifiers } from './Modifiers/Listeners/Listeners';
import type { ElementAttribute, SecurityPolicyAttribute, SecurityPolicyViewModifiers } from './Modifiers/Attributes';
import type { ReferrerPolicyOptions } from './Enum/ReferrerPolicyOptions';
import type { Crossorigin } from './Enum/Crossorigin';
import type { Styles } from './Modifiers/Styles';
import type { MediaStyleInterface } from '../Styles/CSS/Types';
import { ViewsList } from './Modifiers/ListView';
import { ViewBuilder } from './ViewBuilder';
import { ViewModifiers } from './ViewModifiers';
import { Direction, FitPositionStyle, MediaFit, Units } from '../Styles/CSS';







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


	public getRectElements(): void { return }



	constructor(type: string, url: string, useSrcset: boolean = false) {
		super();
		this.content = type;
		this.url = url;
		this.useSrcset = useSrcset;
	}
}
















export abstract class ViewMediaElement<E extends HTMLElement | { parent: HTMLElement; image: HTMLElement }, S extends ImageMimeType | string> extends ViewModifiers<E> implements SecurityPolicyViewModifiers, LoadingResourceModifiers {

	protected abstract override styles: Styles<MediaStyleInterface>
	protected abstract override listeners?: Listeners<LoadingResourceListeners<any>>
	protected abstract override attribute?: ElementAttribute<SecurityPolicyAttribute>

	protected abstract useCSSVariablesForMediaStyles?: boolean
	protected abstract useSrcsetSource?: boolean
	protected abstract sourceList?: ViewsList


	protected override importProperty(view: ViewMediaElement<any, any>): ReturnType<ViewModifiers<any>['importProperty']> {
		this.sourceList = view.sourceList;
		this.useCSSVariablesForMediaStyles = view.useCSSVariablesForMediaStyles;
		this.useSrcsetSource = view.useSrcsetSource;
		return super.importProperty(view);
	}








	public referrerPolicy(value: ReferrerPolicyOptions): this { this.safeAttribute.set('referrerpolicy', value); return this }
	public crossorigin(value: Crossorigin): this { this.safeAttribute.set('crossorigin', value); return this }
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


	public onLoad(value: () => void): this { this.safeListeners.set('load', () => value()); return this }
	public onError(value: (error: any) => void): this { this.safeListeners.set('error', (_, event) => value(event.error)); return this }
}
