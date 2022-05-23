import type { ScrollSnapType } from '../Styles/CSS/Enums/ScrollSnapType';
import type { ListenersInterface, Listeners } from './Modifiers/Listeners/Listeners';
import type { ViewBuilder } from './ViewBuilder';
import type { GridTrackClass } from './Modifiers/GridTrack';
import type { GridTrackRepeat } from './Enum/GridTrackRepeat';
import type { CompositingCoords } from './Modifiers/Compositing';
import type { Side } from './Enum/Side';
import type { Styles } from './Modifiers/Styles';
import type { ElementsContainerStyles } from '../Styles/CSS/Types';
import { ViewsList } from './Modifiers/ListView';
import { Direction } from '../Styles/CSS/Enums/Direction';
import { Units } from '../Styles/CSS/Enums/Units';
import { ViewModifiers } from './ViewModifiers';
import { Scroll } from '../Styles/CSS/Enums/Scroll';
import { ContentAlign } from '../Styles/CSS/Enums/ContentAlign';
import { MainStyleSheet, CSSSelectore } from '../Styles/CSS';






export interface ElementsContainerListeners<E extends HTMLElement> extends ListenersInterface<E> {
	'scroll'?: (element: E, event: MouseEvent) => any
	'dragover'?: (element: E, event: DragEvent) => any
	'drop'?: (element: E, event: DragEvent) => any
	'dragleave'?: (element: E, event: DragEvent) => any
	'dragenter'?: (element: E, event: DragEvent) => any
}






MainStyleSheet.add(
	new CSSSelectore('.container', {
		'display': 'flex',
		'inline-size': '100%',
		'min-inline-size': 0,
		'flex-flow': 'column wrap',
		'justify-content': ContentAlign.center,
		'align-items': ContentAlign.center,
		'align-content': ContentAlign.center,
		'overscroll-behavior': 'none'
	}),
	new CSSSelectore('.grid', {
		'display': 'grid',
		'grid-auto-flow': Direction.vertical,
	}),
	new CSSSelectore('.scroll', { 'flex-wrap': 'nowrap' }),
	new CSSSelectore('.scroll > *', { 'flex-shrink': 0 }),


	new CSSSelectore('.depth', { 'position': 'relative' }),
	new CSSSelectore('.depth > *', { 'position': 'absolute', 'inset': 0 }),
	new CSSSelectore('.depth > *:last-child', { 'inset': 'auto' })
)



export abstract class ViewElementsContainer<E extends HTMLElement | { parent: HTMLElement }> extends ViewModifiers<E> {

	protected abstract override styles: Styles<ElementsContainerStyles>
	protected abstract override listeners?: Listeners<ElementsContainerListeners<any>>

	protected content: ViewsList

	protected isScroll?: boolean
	protected isGrid?: boolean
	protected directionToken?: Direction
	protected flexDirectionRevers?: boolean






	protected override renderModifiers(element: HTMLElement, newRender?: ViewElementsContainer<any>, withAnimation?: boolean): ReturnType<ViewModifiers<any>['renderModifiers']> {
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
				else this.isGrid
					? this.styles.set('grid-auto-flow', `${this.directionToken} dense`)
					: this.styles.set('flex-direction', this.flexDirectionRevers ? `${this.directionToken}-reverse` : this.directionToken)

			if (this.isScroll) { if (!list.contains('scroll')) list.add('scroll') }
			else if (list.contains('scroll')) list.remove('scroll')

			return super.renderModifiers(element, newRender)
		}


		if (this.isGrid) list.add('grid');

		if (this.directionToken)
			if (this.directionToken == Direction.depth) { if (!this.isGrid) list.add('depth') }
			else this.isGrid
				? this.styles.set('grid-auto-flow', `${this.directionToken} dense`)
				: this.styles.set('flex-direction', this.flexDirectionRevers ? `${this.directionToken}-reverse` : this.directionToken)

		if (this.isScroll) list.add('scroll')

		return super.renderModifiers(element, newRender, withAnimation)
	}


	protected override importProperty(view: ViewElementsContainer<any>): void {
		if (view.isScroll) this.isScroll = view.isScroll;
		if (view.isGrid) this.isGrid = view.isGrid;
		if (view.directionToken) this.directionToken = view.directionToken;
		return super.importProperty(view)
	}




	protected abstract override merge?(newRender: ViewElementsContainer<any>, HTMLElement: E): void























	public elements(...value: (ViewBuilder | undefined)[]): this { this.content.replace(value); return this }
	/** @param value default true */
	public animateChild(value: boolean = true): this { this.animations.withChild = value; return this }
	/** ⚠️ check browser compatibility https://caniuse.com/?search=gap */
	public gap(direction: Direction.horizontal | Direction.vertical, value: number, unit: Units = Units.px): this {
		switch (direction) {
			case Direction.horizontal: this.styles.set('row-gap', `${value}${unit}`); break;
			case Direction.vertical: this.styles.set('column-gap', `${value}${unit}`); break;
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
	public direction(value?: Direction, flexReverse: boolean = false): this {
		if (value) this.directionToken = value;
		if (flexReverse) this.flexDirectionRevers = flexReverse;
		return this
	}
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
		if (horizontal) this.styles.set('scroll-snap-type', `block ${horizontal}`);
		if (vertical) this.styles.set('scroll-snap-type', `inline ${vertical}`);
		return this
	}
	public scrollSnapPadding(side: Side, value: number, unit: Units = Units.px) { this.setSideStyles('scroll-padding', side, String(value) + unit); return this }

	/** @param value default true */
	public unwrap(value: boolean = true): this { if (value) this.styles.set('flex-wrap', 'nowrap'); return this }
	/** @param value default true */
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
















	public override update(newRender: ViewElementsContainer<any>): void {
		if (!this.HTMLElement) { this.importProperty(newRender); return }
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;

		if (this.merge) this.merge(newRender, this.HTMLElement);
		this.content.render(element, true, newRender.content);
		this.renderModifiers(element, newRender);
	}

	public override render(withAnimation: boolean = false): HTMLElement {
		if (this.HTMLElement) return this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;

		this.HTMLElement = this.generateHTMLElement();
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;
		element.classList.add('container');

		this.content.render(element, this.animations.withChild);
		this.renderModifiers(element, undefined, withAnimation);

		return element
	}





	public override destroy(withAnimation: boolean = false): Promise<void> | void {
		if (withAnimation && this.HTMLElement) {
			let parenAnimations = super.destroy(true);

			if (this.animations.withChild) {
				let animations: (Promise<void> | void)[] = this.content.destroy(true);
				animations.push(parenAnimations);

				return Promise.all(animations).then();
			}
			return parenAnimations?.then(() => this.content.destroy())
		}

		this.content.destroy();
		return super.destroy()
	}


	public override getRectElements(storage: Map<HTMLElement, CompositingCoords>): void {
		super.getRectElements(storage);
		this.content.forEach(view => { view?.getRectElements(storage) });
	}










	constructor(value: (ViewBuilder | undefined)[]) {
		super();
		this.content = new ViewsList(value)
	}
}