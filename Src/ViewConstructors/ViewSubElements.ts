import type { ContentAlign } from "./Enum/ContentAlign";
import type { ScrollSnapType } from "./Enum/ScrollSnapType";
import type { ListenersInterface, Listeners } from "./Styles/Listeners";
import type { StylesInterface, Styles } from "./Styles/Styles";
import type { ViewBuilder } from "./ViewBuilder";
import type { GridTrackClass } from "./Styles/GridTrack";
import type { GridTrackRepeat } from "./Enum/GridTrackRepeat";
import { ViewsList } from "./Styles/ListView";
import { Side } from "./Enum/Side";
import { Direction } from "./Enum/Direction";
import { Units } from "./Enum/Units";
import { ViewModifiers } from "./ViewModifiers";
import { Scroll } from "./Enum/Scroll";




export interface SubElementsStyles extends StylesInterface {
	'row-gap'?: string
	'column-gap'?: string
	'align-items'?: ContentAlign
	'justify-items'?: ContentAlign
	'align-content'?: ContentAlign
	'justify-content'?: ContentAlign

	'scroll-snap-type'?: string
	'scroll-padding-top'?: string
	'scroll-padding-right'?: string
	'scroll-padding-bottom'?: string
	'scroll-padding-left'?: string

	'grid-template-columns'?: string
	'grid-template-rows'?: string
	'grid-auto-columns'?: string
	'grid-auto-rows'?: string
	'grid-auto-flow'?: `${Direction.horizontal | Direction.vertical} dense`;

	'flex-wrap'?: 'nowrap' | 'wrap'
	'flex-direction'?: Direction
}
export interface SubElementsListeners<E extends HTMLElement> extends ListenersInterface<E> {
	'scroll'?: (element: E, event: MouseEvent) => any
	'dragover'?: (element: E, event: DragEvent) => any
	'drop'?: (element: E, event: DragEvent) => any
	'dragleave'?: (element: E, event: DragEvent) => any
	'dragenter'?: (element: E, event: DragEvent) => any
}










export abstract class ViewSubElements<E extends HTMLElement | { parent: HTMLElement }> extends ViewModifiers<E> {

	protected abstract styles: Styles<SubElementsStyles>
	protected abstract listeners?: Listeners<SubElementsListeners<any>>
	protected content: ViewsList
	protected isScroll?: boolean
	protected isGrid?: boolean
	protected directionToken?: Direction





	protected renderModifiers(element: HTMLElement, newRender?: ViewSubElements<any>, withAnimatiom?: boolean): ReturnType<ViewModifiers<any>['renderModifiers']> {
		const list = element.classList;

		if (newRender) {
			this.styles = newRender.styles;
			this.directionToken = newRender.directionToken;
			this.isScroll = newRender.isScroll;
			this.isGrid = newRender.isGrid;


			if (this.isGrid) { if (!list.contains('grid')) list.add('grid') }
			else if (!list.contains('grid')) list.remove('grid');


			if (list.contains('depth') && (this.isGrid || this.directionToken != Direction.depth)) list.remove('depth')
			else if (this.directionToken)
				if (this.directionToken == Direction.depth) list.add('depth');
				else this.isGrid ? this.styles.set('grid-auto-flow', `${this.directionToken} dense`) : this.styles.set('flex-direction', this.directionToken)

			if (this.isScroll) { if (!list.contains('scroll')) list.add('scroll') }
			else if (list.contains('scroll')) list.remove('scroll')

			return super.renderModifiers(element, newRender)
		}


		// list.add('container');
		if (this.isGrid) list.add('grid');

		if (this.directionToken)
			if (this.directionToken == Direction.depth) { if (!this.isGrid) list.add('depth') }
			else this.isGrid ? this.styles.set('grid-auto-flow', `${this.directionToken} dense`) : this.styles.set('flex-direction', this.directionToken)

		if (this.isScroll) list.add('scroll')

		return super.renderModifiers(element, newRender, withAnimatiom)
	}


	protected importProperty(view: ViewSubElements<any>): void {
		if (view.isScroll) this.isScroll = view.isScroll;
		if (view.isGrid) this.isGrid = view.isGrid;
		if (view.directionToken) this.directionToken = view.directionToken;
		return super.importProperty(view)
	}




	protected abstract merge?(newRender: ViewSubElements<any>, HTMLElement: E): void























	public elements(...value: (ViewBuilder | undefined)[]): this { this.content.replace(value); return this }
	/** @param value defualt true */
	public animateChild(value: boolean = true): this { this.animations.withChild = value; return this }
	/** ⚠️ check browser compatibility https://caniuse.com/?search=gap */
	public gap(direction: Direction.horizontal | Direction.vertical, value: number, unit: Units = Units.px): this {
		switch (direction) {
			case Direction.horizontal: this.styles.set('row-gap', value.toString() + unit); break;
			case Direction.vertical: this.styles.set('column-gap', value.toString() + unit); break;
		}
		return this
	}
	/** ↔︎ */ public HGridTemplate(values: GridTrackClass[], repeat?: GridTrackRepeat | number): this {
		this.isGrid = true;
		this.styles.set('grid-template-columns', repeat ? `repeat(${repeat},${values.join(' ')})` : values.join(' '));
		return this
	}
	/** ↕︎ */ public VGridTemplate(values: GridTrackClass[], repeat?: GridTrackRepeat | number): this {
		this.isGrid = true;
		this.styles.set('grid-template-rows', repeat ? `repeat(${repeat},${values.join(' ')})` : values.join(' '));
		return this
	}
	/** ↔︎ */ public HGridTemplateAuto(...values: GridTrackClass[]): this {
		this.isGrid = true;
		this.styles.set('grid-auto-columns', values.join(' '))
		return this
	}
	/** ↕︎ */ public VGridTemplateAuto(...values: GridTrackClass[]): this {
		this.isGrid = true;
		this.styles.set('grid-auto-rows', values.join(' '))
		return this
	}
	public direction(value: Direction): this { this.directionToken = value; return this }
	public alignItems(value: ContentAlign): this { this.styles.set('align-items', value); return this }
	public alignContent(value: ContentAlign): this { this.styles.set('align-content', value); return this }
	public justifyItems(value: ContentAlign): this { this.styles.set('justify-items', value); return this }
	public justifyContent(value: ContentAlign): this { this.styles.set('justify-content', value); return this }

	public fixedSize(horizontal?: Scroll, vertical?: Scroll): this {
		if (horizontal == Scroll.auto || horizontal == Scroll.scroll || vertical == Scroll.auto || vertical == Scroll.scroll) this.isScroll = true;
		if (horizontal) this.styles.set('overflow-x', horizontal);
		if (vertical) this.styles.set('overflow-y', vertical);
		return this
	}
	/** only one */
	public scrollSnap(horizontal?: ScrollSnapType, vertical?: ScrollSnapType): this {
		if (horizontal) this.styles.set('scroll-snap-type', 'x ' + horizontal);
		if (vertical) this.styles.set('scroll-snap-type', 'y ' + vertical);
		return this
	}
	public scrollSnapPadding(side: Side, value: number, unit: Units = Units.px) { this.setSideStyles('scroll-padding-', side, value, unit); return this }

	/** @param value defualt true */
	public unwrap(value: boolean = true): this { if (value) this.styles.set('flex-wrap', 'nowrap'); return this }
	/** @param value defualt true */
	public scrollBehavior(value: boolean = true): this { this.styles.set('scroll-behavior', value ? 'smooth' : 'auto'); return this }




	// public onScroll(value: (element: HTMLElement, event: MouseEvent) => void): this { this.safeListeners.set('scroll', value); return this }
	public onDrop(allowTypes: string[], action: (data: (DataTransferItem | File)[]) => void, isOver?: (value: boolean) => void): this {
		this.safeListeners.set('dragover', (_, event) => event.preventDefault())
		this.safeListeners.set('dragenter', (_: HTMLElement, event) => {
			if (!event.dataTransfer) return

			let result = false;
			if (allowTypes.length > 0) {
				for (let item of event.dataTransfer.files) if (allowTypes.includes(item.type)) { result = true; break }
				for (let item of event.dataTransfer.items) if (allowTypes.includes(item.type)) { result = true; break }
			} else result = true

			if (result) {
				if (isOver) isOver(true)
				return event.preventDefault()
			}
		})
		if (isOver) this.safeListeners.set('dragleave', () => isOver(false))
		this.safeListeners.set('drop', (_, event) => {
			if (!event.dataTransfer) return

			let resultArray: (DataTransferItem | File)[] = [];
			if (allowTypes.length > 0) {
				for (let item of event.dataTransfer.files) if (allowTypes.includes(item.type)) resultArray.push(item)
				for (let item of event.dataTransfer.items) if (item.kind != 'file' && allowTypes.includes(item.type)) resultArray.push(item)
			} else {
				for (let item of event.dataTransfer.files) resultArray.push(item)
				for (let item of event.dataTransfer.items) if (item.kind != 'file') resultArray.push(item)
			}

			action(resultArray)
			return event.preventDefault()
		})

		return this
	}


















	public render(newRender?: ViewSubElements<any>, withAnimatiom?: boolean): HTMLElement {
		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			this.HTMLElement = this.generateHTMLElement();
			let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;
			element.classList.add('container');

			this.content.render(element, withAnimatiom || this.animations.withChild);
			this.renderModifiers(element, undefined, withAnimatiom);

			return element
		}

		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;
		// not change
		if (!newRender) { this.update(this.HTMLElement); return element }

		// changes
		if (this.merge) this.merge(newRender, this.HTMLElement);
		this.content.render(element, true, newRender.content);
		this.renderModifiers(element, newRender, withAnimatiom);
		return element;
	}





	public destroy(withAnimatiom?: boolean): Promise<void> | void {
		if (withAnimatiom && this.HTMLElement) {
			if (this.animations.withChild) {
				let animations = this.content.map(v => v?.destroy(true));
				animations.push(
					this.animations.animateDestruction(this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent)
						?.then(() => super.destroy())
				)
				return Promise.all(animations).then(() => { if (this.HTMLElement) super.destroy() });
			}
			return super.destroy(withAnimatiom)?.then(() => void this.content.forEach(element => element?.destroy()))
		}

		this.content.forEach(element => element?.destroy());
		return super.destroy()
	}










	constructor(value: (ViewBuilder | undefined)[]) {
		super();
		this.content = new ViewsList(value)
	}
}