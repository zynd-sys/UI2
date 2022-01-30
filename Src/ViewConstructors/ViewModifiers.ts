import type { Align } from "./Enum/Align"
import type { ContentAlign } from "./Enum/ContentAlign"
import type { CubicBezier } from "./Modifiers/Animation/CubicBezier"
import type { MinimalStylesInterface, cursorType } from "./Modifiers/CSS/Types/MinimalStylesType"
import type { Styles } from "./Modifiers/CSS/Styles"
import type { View } from "../Elements/View"
import type { UIAnimationClass } from "./Modifiers/Animation/UIAnimation"
import type { CompositingCoords } from "./Modifiers/Compositing"
import type { Color } from "./Modifiers/Colors/Colors"
import type { GestureClass } from "./Modifiers/Listeners/Gesture/Gesture"
import { ElementAttribute, ElementAttributeInterface } from "./Modifiers/Attributes"
import { Listeners, ListenersInterface } from "./Modifiers/Listeners/Listeners"
import { BorderStyle } from "./Enum/BorderStyle"
import { Side } from "./Enum/Side"
import { Units } from "./Enum/Units"
import { FiltersStyle, FilterStyleInterface } from "./Modifiers/CollectableStyles/FiltersStyle"
import { InnerShadowStyle, DropShadowStyle } from "./Modifiers/CollectableStyles/ShadowStyle"
import { TransformsStyle } from "./Modifiers/CollectableStyles/TransformsStyle"
import { PopoverData } from "./Modifiers/Popover"
import { ViewBuilder } from "./ViewBuilder"
import { SideBorderRadius } from "./Enum/SideBorderRadius"
import { UIAnimationObject } from "./Modifiers/Animation/UIAnimationObject"
import { ScrollObserver } from "./Modifiers/ScrollObserver"
import { DefaultColor } from "./Modifiers/Colors/DefaultColors"
import { ScrollIntoSelf } from "./Modifiers/ScrollIntoSelf"
import { Binding as BindingObserve, isObserved } from "../Data/Observed"
import { PageData } from "../Data/PageData/PageData"
import { CSSSelectore } from "./Modifiers/CSS/CSSSelectore";
import { MainStyleSheet } from "./Modifiers/CSS/MainStyleSheet";
import { TimingFunction } from "./Enum/TimingFunction"










MainStyleSheet.add(
	new CSSSelectore('*', {
		'margin': 0,
		'padding': 0,
		'border-width': 0,
		'box-sizing': 'border-box',
		'transition-property': 'background-color, border-color',
		'transition-duration': '.6s',
		'transition-timing-function': TimingFunction.easeInOut
	}),
	new CSSSelectore(':focus', { 'outline': 'none' })
)




export abstract class ViewModifiers<E extends HTMLElement | { parent: HTMLElement }> extends ViewBuilder {

	protected abstract HTMLElement?: E

	protected abstract styles: Styles<MinimalStylesInterface>
	/** event listeners for html element */
	protected abstract listeners?: Listeners<ListenersInterface<any>>
	// @ts-ignore
	protected get safeListeners(): NonNullable<this['listeners']> { return this.listeners ? this.listeners : this.listeners = new Listeners }
	/** html element attributes */
	protected abstract attribute?: ElementAttribute<ElementAttributeInterface>
	// @ts-ignore
	protected get safeAttribute(): NonNullable<this['attribute']> { return this.attribute ? this.attribute : this.attribute = new ElementAttribute }

	/**  */
	protected popoverData?: PopoverData
	protected scrollSelf?: ScrollIntoSelf
	protected gestureState?: GestureClass<any>

	protected animations: UIAnimationObject = new UIAnimationObject

	protected scrollObserver?: ScrollObserver
	protected get safeScrollObserver() { return this.scrollObserver ? this.scrollObserver : this.scrollObserver = new ScrollObserver }



	/** import: styles, Listeners, content, isPresentedModals, attribute? */
	protected importProperty(view: ViewModifiers<any>): void {
		this.styles = view.styles;
		this.content = view.content;
		this.animations = view.animations;
		if (view.attribute) this.attribute = view.attribute;
		if (view.listeners) this.listeners = view.listeners;
		if (view.popoverData) this.popoverData = view.popoverData;
		if (view.scrollSelf) this.scrollSelf = view.scrollSelf;
	}

	protected renderModifiers(element: HTMLElement, newRender?: ViewModifiers<any>, withAnimation?: boolean): void {
		if (newRender) {
			if (this.popoverData || newRender.popoverData) {
				if (this.popoverData && !newRender.popoverData) { this.popoverData.destroy(); this.popoverData = undefined }
				else if (newRender.popoverData) { this.popoverData = newRender.popoverData; this.popoverData.render() }
			}

			this.styles = newRender.styles.render(element);
			if (newRender.gestureState) {
				if (this.gestureState) if (this.gestureState.constructor != newRender.gestureState.constructor) console.error('different gesture')
				else this.gestureState = newRender.gestureState;
			} else if (this.gestureState) this.gestureState = undefined
			if (newRender.listeners) this.listeners = newRender.listeners.render(element, this.gestureState);
			else if (this.listeners) { this.listeners.destroy(element); this.listeners = undefined }
			if (newRender.attribute) this.attribute = newRender.attribute.render(element)
			else if (this.attribute) { this.attribute.destroy(element); this.attribute = undefined }
			if (newRender.scrollObserver) this.scrollObserver = newRender.scrollObserver.render(element)
			else if (this.scrollObserver) { this.scrollObserver.destroy(element); this.scrollObserver = undefined }
			if (newRender.scrollSelf) this.scrollSelf = newRender.scrollSelf.render(element)
			else this.scrollSelf = undefined;

			return
		}

		this.styles.render(element);
		if (!element.isConnected) {
			if (withAnimation) this.animations.animateCreation(element)
			this.popoverData?.render();
			this.scrollObserver?.render(element);
			this.listeners?.render(element, this.gestureState);
			this.attribute?.render(element);
			this.scrollSelf?.render(element);
		}

		return
	}

	protected abstract generateHTMLElement(): E
	protected abstract merge?(newRender: ViewModifiers<any>, HTMLElement: E): void





















	protected setSideStyles(property: 'inset' | 'border' | 'padding' | 'margin' | 'scroll-padding', side: Side, value: string, postfix: '-width' | '-style' | '-color' | '' = '') {
		switch (side) {
			case Side.all:
				this.styles.set(property + '-block-end' + postfix as any, value);
				this.styles.set(property + '-block-start' + postfix as any, value);
				this.styles.set(property + '-inline-end' + postfix as any, value);
				this.styles.set(property + '-inline-start' + postfix as any, value);
				break
			case Side.leftRight:
				this.styles.set(property + '-inline-end' + postfix as any, value);
				this.styles.set(property + '-inline-start' + postfix as any, value);
				break
			case Side.topBottom:
				this.styles.set(property + '-block-end' + postfix as any, value);
				this.styles.set(property + '-block-start' + postfix as any, value);
				break
			case Side.bottom: this.styles.set(property + '-block-end' + postfix as any, value); break
			case Side.left: this.styles.set(property + '-inline-start' + postfix as any, value); break
			case Side.right: this.styles.set(property + '-inline-end' + postfix as any, value); break
			case Side.top: this.styles.set(property + '-block-start' + postfix as any, value); break
		}
	}






	// add context menu??



	// mix-blend-mode
	// background-blend-mode


	public srcollIntoSelf(isScroll: boolean, onEndScroll: () => void): (HAlign?: Align.start | Align.center | Align.end, VAlign?: Align.start | Align.center | Align.end, animated?: boolean) => this {
		return (HAlign, VAlign, animated) => { if (isScroll) this.scrollSelf = new ScrollIntoSelf(onEndScroll, HAlign, VAlign, animated ? 'smooth' : undefined); return this }
	}


	// public title(value?: string): this { if (value) this.ti = value; return this }
	public popover<V extends new (...p: any[]) => View>(isPresented: boolean, view: V, ...data: ConstructorParameters<V>): this { if (isPresented) this.popoverData = new PopoverData(view, data); return this }
	public backgroundColor(value?: Color): this { if (value) this.styles.set('background-color', value); return this }
	/** @param value defualt true */
	public userSelect(value: boolean = true): this { if (value) this.styles.set('-webkit-user-select', 'auto').set('user-select', 'auto'); return this }
	/** @param value defualt "auto" */
	public cursor(value: cursorType = 'auto'): this { this.styles.set('cursor', value); return this }
	/**
	 * @param value default true
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
	 */
	public tabindex(value: number = 0): this { this.safeAttribute.set('tabindex', value); return this }







	// Size
	public width(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('inline-size', `${value}${unit}`); return this }
	public maxWidth(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('max-inline-size', `${value}${unit}`); return this }
	public minWidth(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('min-inline-size', `${value}${unit}`); return this }

	public height(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('block-size', `${value}${unit}`); return this }
	public maxHeight(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('max-block-size', `${value}${unit}`); return this }
	public minHeight(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('min-block-size', `${value}${unit}`); return this }

	public growSelf(value?: number): this { if (value) this.styles.set('flex-grow', value); return this }

	public padding(side: Side, value: number, unit: Units = Units.px): this { this.setSideStyles('padding', side, `${value}${unit}`); return this }
	public margin(side: Side, value: number, unit: Units = Units.px): this { this.setSideStyles('margin', side, `${value}${unit}`); return this }







	public outlineWidth(value: number, unit: Units = Units.px): this { this.styles.set('outline-width', `${value}${unit}`); return this }
	public outlineOffset(value: number, unit: Units = Units.px): this { this.styles.set('outline-offset', `${value}${unit}`); return this }
	/** @param value defualt BorderStyle.solid */
	public outlineStyle(value: BorderStyle = BorderStyle.solid): this { this.styles.set('outline-style', value); return this }
	/** @param value defualt black(#000) */
	public outlineColor(value: Color = DefaultColor.black): this { this.styles.set('outline-color', value); return this }
	public borderWidth(side: Side, value: number, unit: Units = Units.px): this { this.setSideStyles('border', side, `${value}${unit}`, '-width'); return this }
	/** @param value defualt BorderStyle.solid */
	public borderStyle(value: BorderStyle = BorderStyle.solid, side: Side = Side.all): this { this.setSideStyles('border', side, value, '-style'); return this }
	/** @param value defualt black(#000) */
	public borderColor(value: Color = DefaultColor.black, side: Side = Side.all): this { this.setSideStyles('border', side, value.toString(), '-color'); return this }
	public borderRadius(side: SideBorderRadius, value: number, unit: Units = Units.px): this {
		let v = `${value}${unit}` as `${number}${Units}`;
		switch (side) {
			case SideBorderRadius.all:
				this.styles.set('border-start-start-radius', v);
				this.styles.set('border-start-end-radius', v);
				this.styles.set('border-end-start-radius', v);
				this.styles.set('border-end-end-radius', v);
				break
			case SideBorderRadius.top:
				this.styles.set('border-start-start-radius', v);
				this.styles.set('border-start-end-radius', v);
				break
			case SideBorderRadius.bottom:
				this.styles.set('border-end-start-radius', v);
				this.styles.set('border-end-end-radius', v);
				break
			case SideBorderRadius.left:
				this.styles.set('border-start-start-radius', v);
				this.styles.set('border-end-start-radius', v);
				break
			case SideBorderRadius.right:
				this.styles.set('border-start-end-radius', v);
				this.styles.set('border-end-end-radius', v);
				break
			case SideBorderRadius.topLeft: this.styles.set('border-start-start-radius', v); break
			case SideBorderRadius.topRight: this.styles.set('border-start-end-radius', v); break
			case SideBorderRadius.bottomLeft: this.styles.set('border-end-start-radius', v); break
			case SideBorderRadius.bottomRight: this.styles.set('border-end-end-radius', v); break
		}
		return this
	}









	// position
	/** @param value default true */
	public positionSticky(value: boolean = true, ZIndex: number = 100): this { if (value) { this.styles.set('position', 'sticky'); this.styles.set('z-index', ZIndex) }; return this }
	public position(side: Side, value: number, unit: Units = Units.px): this { this.setSideStyles('inset', side, `${value}${unit}`); return this }
	public orderSelf(value?: number): this { if (value) this.styles.set('order', value); return this }
	public alignSelf(value?: ContentAlign): this { if (value) this.styles.set('align-self', value); return this }
	public justifySelf(value?: ContentAlign): this { if (value) this.styles.set('justify-self', value); return this }
	public scrollSnapAlignSelf(value?: Align): this { if (value) this.styles.set('scroll-snap-align', value); return this }
	/** ↕︎ */
	public VGridLines(start?: number, end?: number, endSpan?: boolean): this {
		if (start) this.styles.set('grid-row-start', start);
		if (end) this.styles.set('grid-row-end', endSpan ? `span ${end}` : end);
		return this
	}
	/** ↔︎ */
	public HGridLines(start?: number, end?: number, endSpan?: boolean): this {
		if (start) this.styles.set('grid-column-start', start);
		if (end) this.styles.set('grid-column-end', endSpan ? `span ${end}` : end);
		return this
	}












	// animation
	public animationCreate(value: ((coordinates: () => DOMRect) => UIAnimationClass) | undefined): this { this.animations.created = value; return this }
	public animationDestroy(value: ((coordinates: () => DOMRect) => UIAnimationClass) | undefined): this { this.animations.destroyed = value; return this }
	/**
	 * @param {number} duration ms
	 * @param {number} delay ms
	 * @description 1000ms = 1s
	 */
	public transition(duration: number, timingFunction?: TimingFunction | CubicBezier, delay?: number): this {
		if (PageData.reducedAnimation) return this
		this.styles
			.set('transition-property', 'all')
			.set('transition-duration', `${duration}ms`);
		if (delay) this.styles.set('transition-delay', `${delay}ms`);
		if (timingFunction) this.styles.set('transition-timing-function', timingFunction);
		return this
	}








	// shadow
	public dropShadowOffsetX(value: number, unit: Units = Units.px): this { this.styles.getCollectableStyles('filter', FiltersStyle).getCollectableStyles('drop-shadow', DropShadowStyle)['offset-x'] = `${value}${unit}`; return this }
	public dropShadowOffsetY(value: number, unit: Units = Units.px): this { this.styles.getCollectableStyles('filter', FiltersStyle).getCollectableStyles('drop-shadow', DropShadowStyle)['offset-y'] = `${value}${unit}`; return this }
	public dropShadowBlurRadius(value: number, unit: Units = Units.px): this { this.styles.getCollectableStyles('filter', FiltersStyle).getCollectableStyles('drop-shadow', DropShadowStyle)['blur-radius'] = `${value}${unit}`; return this }
	public dropShadowColor(value: Color): this { this.styles.getCollectableStyles('filter', FiltersStyle).getCollectableStyles('drop-shadow', DropShadowStyle)['color'] = value; return this }
	public innerShadowOffsetX(value: number, unit: Units = Units.px): this { this.styles.getCollectableStyles('box-shadow', InnerShadowStyle)['offset-x'] = `${value}${unit}`; return this }
	public innerShadowOffsetY(value: number, unit: Units = Units.px): this { this.styles.getCollectableStyles('box-shadow', InnerShadowStyle)['offset-y'] = `${value}${unit}`; return this }
	public innerShadowBlurRadius(value: number, unit: Units = Units.px): this { this.styles.getCollectableStyles('box-shadow', InnerShadowStyle)['blur-radius'] = `${value}${unit}`; return this }
	public innerShadowColor(value: Color): this { this.styles.getCollectableStyles('box-shadow', InnerShadowStyle)['color'] = value; return this }







	protected setFilterPrefix(property: keyof FilterStyleInterface, backdrop: boolean, value: any): this {
		this.styles.getCollectableStyles(backdrop ? 'backdrop-filter' : 'filter', FiltersStyle).set(property, value);
		if (backdrop) this.styles.getCollectableStyles('-webkit-backdrop-filter', FiltersStyle).set(property, value);
		return this
	}
	// effects
	/** 
	 * @param horizontal ↔︎ — % percentage
	 * @param vertical ↕︎ — % percentage
	 */
	public transformOrigin(horizontal: number, vertical: number): this { this.styles.set('transform-origin', `${horizontal}% ${vertical}%`); return this }
	public perspective(value: number, unit: Units = Units.px): this { this.styles.set('perspective', value + unit); return this }
	public blurEffect(value: number, unit: Units = Units.px, backdrop: boolean = false): this { return this.setFilterPrefix('blur', backdrop, value + unit) }
	public brightnessEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('brightness', backdrop, value) }
	public contrastEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('contrast', backdrop, value) }
	public grayscaleEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('grayscale', backdrop, value) }
	public hueRotateEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('hueRotate', backdrop, `${value}deg`) }
	public invertEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('invert', backdrop, value) }
	public saturateEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('saturate', backdrop, value) }
	public sepiaEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('sepia', backdrop, value) }
	/** @param value 0.0...1.0 */
	public opacityEffect(value: number, backdrop: boolean = false): this { if (backdrop) this.setFilterPrefix('opacity', backdrop, value); else this.styles.set('opacity', value); return this }
	// matrix | matrix3d
	/**   */ public rotateXEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('rotateX', `${value}deg`); return this }
	/**   */ public rotateYEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('rotateY', `${value}deg`); return this }
	/**   */ public rotateZEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('rotateZ', `${value}deg`); return this }
	/** ↔︎ */ public scaleXEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('scaleX', value); return this }
	/** ↕︎ */ public scaleYEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('scaleY', value); return this }
	/** ↘︎ */ public scaleZEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('scaleZ', value); return this }
	/**   */ public skewXEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('skewX', `${value}deg`); return this }
	/**   */ public skewYEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('skewY', `${value}deg`); return this }
	/** ↔︎ */ public translateXEffect(value: number, unit = Units.absolute): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('translateX', `${value}${unit}`); return this }
	/** ↕︎ */ public translateYEffect(value: number, unit = Units.absolute): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('translateY', `${value}${unit}`); return this }
	/** ↘︎ */ public translateZEffect(value: number, unit = Units.px): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('translateZ', `${value}${unit}`); return this }





	public writeMode(dir?: 'rtl' | 'rtl', lang?: string, translate?: boolean): this {
		if (dir) this.safeAttribute.set('dir', dir);
		if (lang) this.safeAttribute.set('lang', lang);
		if (typeof translate == 'boolean') this.safeAttribute.set('translate', translate ? 'yes' : 'no')
		return this
	}










	// Listner
	/** @param threshold range 0.0...1.0 */
	public onScrollIntersection(...threshold: number[]): (value: BindingObserve<number> | ((intersectionRatio: number, coordinates: DOMRect) => void)) => this {
		return value => {
			let observer = this.safeScrollObserver
			observer.threshold = threshold;
			observer.userHandler = isObserved(value)
				? ration => value.value = ration
				: (ration, coords) => value(ration, coords);
			return this
		}
	}
	public scrollIntersectionMargin(side: Side, value: number, unit: Units.px | Units.absolute = Units.px): this {
		let style = this.safeScrollObserver.safeRootMargin;
		let v = value.toString() + unit;
		switch (side) {
			case Side.all: style.bottom = style.top = style.left = style.right = v; break
			case Side.leftRight: style.left = style.right = v; break
			case Side.topBottom: style.top = style.bottom = v; break
			case Side.bottom: style.bottom = v; break
			case Side.left: style.left = v; break
			case Side.right: style.right = v; break
			case Side.top: style.top = v; break
		}
		return this
	}
	public popoverOnCliсk<V extends new (...p: any) => View>(view: V, value: (dismiss: () => void, coordinates: () => DOMRect) => [...ConstructorParameters<V>]): this {
		this.safeListeners.set('click', (element: HTMLElement) => {
			let popover = new PopoverData(view);
			popover.data = value(() => popover.destroy(), () => element.getBoundingClientRect());
			popover.render()
		})
		return this
	}
	public onClick(value: (coordinates: () => DOMRect) => void): this { this.safeListeners.set('click', (element: HTMLElement) => value(() => element.getBoundingClientRect())); return this }
	public onHover(value: BindingObserve<boolean> | ((value: boolean) => void)): this {
		this.safeListeners.set('mouseenter', isObserved(value)
			? () => value.value = true
			: () => value(true)
		);
		this.safeListeners.set('mouseleave', isObserved(value)
			? () => value.value = false
			: () => value(false)
		);
		return this
	}
	/** set onfocus listners and add tabindex 0 */
	public onFocus(value: BindingObserve<boolean> | ((value: boolean) => void), tabindex: number = 0): this {
		this.safeAttribute.set('tabindex', tabindex);
		this.safeListeners.set('focusin', isObserved(value)
			? () => value.value = true
			: () => value(true)
		);
		this.safeListeners.set('focusout', isObserved(value)
			? () => value.value = false
			: () => value(false)
		);
		return this
	}
	public onDrag(data: () => { type: string, data: any }[], action?: (onStart: boolean) => void): this {
		this.safeAttribute.set('draggable', true);
		this.safeListeners.set('dragstart', (_, event) => {
			if (event.dataTransfer) {
				let d = data()
				let dataTransfer = event.dataTransfer
				d.forEach(value => dataTransfer.setData(value.type, value.data))
			}
			if (action) action(true)
		})
		if (action) this.safeListeners.set('dragend', () => action(false))
		return this
	}
	public onTranstionEnd(value: () => void): this { this.safeListeners.set('transitionend', () => value()); return this }
	public gesture(value: () => GestureClass<any>): this {
		this.styles
			.set('touch-action', 'none')
			.set('-webkit-user-select', 'none')
			.set('user-select', 'none');
		this.gestureState = value();
		this.safeListeners.gesture();
		return this
	}
	// public onDoubleClick(value?: Listeners['doubleClick']): this { this.listeners.doubleClick = value; return this }
	// public onContextMenu(value?: Listeners['contextMenu']): this { this.listeners.contextMenu = value; return this }

















	public update(newRender: ViewModifiers<any>): void {
		if (!this.HTMLElement) { this.importProperty(newRender); return }

		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;

		this.merge?.(newRender, this.HTMLElement);
		this.renderModifiers(element, newRender);
	}

	public render(withAnimation: boolean = false): HTMLElement {
		if (this.HTMLElement) return this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent

		this.HTMLElement = this.generateHTMLElement();
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;
		this.renderModifiers(element, undefined, withAnimation);
		return element
	}

	public destroy(withAnimation: boolean = false): Promise<void> | void {
		if (!this.HTMLElement) return
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;

		if (withAnimation) return this.animations.animateDestruction(element)?.then(() => { element.remove(); this.HTMLElement = undefined })
		element.remove();
		this.HTMLElement = undefined
		return

	}

	public getRectElements(storage: Map<HTMLElement, CompositingCoords>): void {
		if (!this.HTMLElement) return
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent
		storage.set(element, element.getBoundingClientRect());
	}
}