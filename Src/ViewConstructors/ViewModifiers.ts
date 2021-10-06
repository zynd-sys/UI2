import type { Align } from "./Enum/Align"
import type { ContentAlign } from "./Enum/ContentAlign"
import type { TimingFunction } from "./Enum/TimingFunction"
import type { CubicBezier } from "./Styles/Animation/CubicBezier"
import type { cursorType, Styles, StylesInterface } from "./Styles/Styles"
import type { View } from "../Elements/View"
import type { UIAnimationClass } from "./Styles/Animation/UIAnimation"
import type { AnimationResize } from "./Enum/AnimationResize"
import type { Color } from "./Styles/Colors/Colors"
import { ElementAttribute, ElementAttributeInterface } from "./Styles/Attributes"
import { Listeners, ListenersInterface } from "./Styles/Listeners"
import { BorderStyle } from "./Enum/BorderStyle"
import { Side } from "./Enum/Side"
import { Units } from "./Enum/Units"
import { FiltersStyle, FilterStyleInterface } from "./Styles/CollectableStyles/FiltersStyle"
import { InnerShadowStyle, DropShadowStyle } from "./Styles/CollectableStyles/ShadowStyle"
import { TransformsStyle } from "./Styles/CollectableStyles/TransformsStyle"
import { PopoverData } from "./Styles/Popover"
import { ViewBuilder } from "./ViewBuilder"
import { SideBorderRadius } from "./Enum/SideBorderRadius"
import { UIAnimationObject } from "./Styles/Animation/UIAnimationObject"
import { ScrollObserver } from "./Styles/ScrollObserver"
import { DefaultColor } from "./Styles/Colors/DefaultColors"
import { ScrollIntoSelf } from "./Styles/ScrollIntoSelf"
















export abstract class ViewModifiers<E extends HTMLElement | { parent: HTMLElement }> extends ViewBuilder {

	protected abstract HTMLElement?: E

	protected abstract styles: Styles<StylesInterface>
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
	protected scrollSafe?: ScrollIntoSelf

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
		if (view.scrollSafe) this.scrollSafe = view.scrollSafe;
	}

	protected renderModifiers(element: HTMLElement, newRender?: ViewModifiers<any>, withAnimatiom?: boolean): void {
		if (newRender) {
			if (this.popoverData || newRender.popoverData) {
				if (this.popoverData && !newRender.popoverData) { this.popoverData.destroy(); this.popoverData = undefined }
				else if (newRender.popoverData) { this.popoverData = newRender.popoverData; this.popoverData.render() }
			}


			this.styles = newRender.styles.render(element);
			if (newRender.listeners) this.listeners = newRender.listeners.render(element);
			else if (this.listeners) { this.listeners.destroy(element); this.listeners = undefined }
			if (newRender.attribute) this.attribute = newRender.attribute.render(element)
			else if (this.attribute) { this.attribute.destroy(element); this.attribute = undefined }
			if (newRender.scrollObserver) this.scrollObserver = newRender.scrollObserver.render(element)
			else if (this.scrollObserver) { this.scrollObserver.destroy(element); this.scrollObserver = undefined }
			if (newRender.scrollSafe) this.scrollSafe = newRender.scrollSafe.render(element)
			else if (this.scrollSafe) this.scrollSafe = undefined;

			return
		}

		this.styles.render(element);
		if (!element.isConnected) {
			if (withAnimatiom) this.animations.animateCreation(element)
			this.popoverData?.render();
			this.scrollObserver?.render(element);
			this.listeners?.render(element);
			this.attribute?.render(element);
			this.scrollSafe?.render(element)
		}

		return
	}

	protected update(element: E): void { this.renderModifiers(element instanceof HTMLElement ? element : element.parent) }
	protected abstract generateHTMLElement(): E
	protected abstract merge?(newRender: ViewModifiers<any>, HTMLElement: E): void




















	protected setSideStyles(property: 'scroll-padding-' | 'padding-' | 'margin-' | 'border-' | '', side: Side, value: number, unit: Units, prefix: string = '') {
		const v = value.toString() + unit;
		switch (side) {
			case Side.all: this.styles.set(property + 'bottom' + prefix as any, v); this.styles.set(property + 'top' + prefix as any, v); this.styles.set(property + 'left' + prefix as any, v); this.styles.set(property + 'right' + prefix as any, v); break
			case Side.leftRight: this.styles.set(property + 'left' + prefix as any, v); this.styles.set(property + 'right' + prefix as any, v); break
			case Side.topBottom: this.styles.set(property + 'bottom' + prefix as any, v); this.styles.set(property + 'top' + prefix as any, v); break
			case Side.bottom: this.styles.set(property + 'bottom' + prefix as any, v); break
			case Side.left: this.styles.set(property + 'left' + prefix as any, v); break
			case Side.right: this.styles.set(property + 'right' + prefix as any, v); break
			case Side.top: this.styles.set(property + 'top' + prefix as any, v); break
		}
	}







	// add context menu??



	// mix-blend-mode
	// background-blend-mode


	public srcollIntoSelf(isScroll: boolean, onEndScroll: () => void): (HAlign?: Align.start | Align.center | Align.end, VAlign?: Align.start | Align.center | Align.end, animated?: boolean) => this {
		return (HAlign, VAlign, animated) => { if (isScroll) this.scrollSafe = new ScrollIntoSelf(onEndScroll, HAlign, VAlign, animated ? 'smooth' : undefined); return this }
	}


	// public title(value?: string): this { if (value) this.ti = value; return this }
	public popover<V extends new (...p: any[]) => View>(isPresented: boolean, view: V, ...data: ConstructorParameters<V>): this { if (isPresented) this.popoverData = new PopoverData(view, data); return this }
	public backgroundColor(value?: Color): this { if (value) this.styles.set('background-color', value); return this }
	/** @deprecated */
	public id(value: string): this { this.safeAttribute.set('id', value); return this }
	/** @param value defualt true */
	public userSelect(value: boolean = true): this { if (value) this.styles.set('user-select', 'auto'); return this }
	/** @param value defualt "auto" */
	public cursor(value: cursorType = 'auto'): this { this.styles.set('cursor', value); return this }
	/**
	 * @param value default true
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
	 */
	public tabindex(value: number = 0): this { this.safeAttribute.set('tabindex', value); return this }







	// Size
	public width(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('width', String(value) + unit); return this }
	public maxWidth(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('max-width', String(value) + unit); return this }
	public minWidth(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('min-width', String(value) + unit); return this }

	public height(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('height', String(value) + unit); return this }
	public maxHeight(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('max-height', String(value) + unit); return this }
	public minHeight(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('min-height', String(value) + unit); return this }

	public growSelf(value?: number): this { if (value) this.styles.set('flex-grow', value); return this }

	public padding(side: Side, value: number, unit: Units = Units.px): this { this.setSideStyles('padding-', side, value, unit); return this }
	public margin(side: Side, value: number, unit: Units = Units.px): this { this.setSideStyles('margin-', side, value, unit); return this }







	public outlineWidth(value: number, unit: Units = Units.px): this { this.styles.set('outline-width', String(value) + unit); return this }
	/** @param value defualt BorderStyle.solid */
	public outlineStyle(value: BorderStyle = BorderStyle.solid): this { this.styles.set('outline-style', value); return this }
	/** @param value defualt black(#000) */
	public outlineColor(value: Color = DefaultColor.black): this { this.styles.set('border-color', value); return this }
	public borderWidth(side: Side, value: number, unit: Units = Units.px): this { this.setSideStyles('border-', side, value, unit, '-width'); return this }
	/** @param value defualt BorderStyle.solid */
	public borderStyle(value: BorderStyle = BorderStyle.solid): this { this.styles.set('border-style', value); return this }
	/** @param value defualt black(#000) */
	public borderColor(value: Color = DefaultColor.black): this { this.styles.set('border-color', value); return this }
	public borderRadius(side: SideBorderRadius, value: number, unit: Units = Units.px): this {
		let v = String(value) + unit;
		switch (side) {
			case SideBorderRadius.all: this.styles.set('border-top-left-radius', v); this.styles.set('border-top-right-radius', v); this.styles.set('border-bottom-left-radius', v); this.styles.set('border-bottom-right-radius', v); break
			case SideBorderRadius.top: this.styles.set('border-top-left-radius', v); this.styles.set('border-top-right-radius', v); break
			case SideBorderRadius.bottom: this.styles.set('border-bottom-left-radius', v); this.styles.set('border-bottom-right-radius', v); break
			case SideBorderRadius.left: this.styles.set('border-top-left-radius', v); this.styles.set('border-bottom-left-radius', v); break
			case SideBorderRadius.right: this.styles.set('border-top-right-radius', v); this.styles.set('border-bottom-right-radius', v); break
			case SideBorderRadius.topLeft: this.styles.set('border-top-left-radius', v); break
			case SideBorderRadius.topRight: this.styles.set('border-top-right-radius', v); break
			case SideBorderRadius.bottomLeft: this.styles.set('border-bottom-left-radius', v); break
			case SideBorderRadius.bottomRight: this.styles.set('border-bottom-right-radius', v); break
		}
		return this
	}









	// position
	/** @param value default true */
	public positionSticky(value: boolean = true): this { if (value) { this.styles.set('position', 'sticky'); this.styles.set('z-index', 100) }; return this }
	public position(side: Side, value: number, unit: Units = Units.px): this { this.setSideStyles('', side, value, unit); return this }
	public orderSelf(value?: number): this { if (value) this.styles.set('order', value); return this }
	public alignSelf(value?: ContentAlign): this { if (value) this.styles.set('align-self', value); return this }
	public justifySelf(value?: ContentAlign): this { if (value) this.styles.set('justify-self', value); return this }
	public scrollSnapAlignSelf(value?: Align): this { if (value) this.styles.set('scroll-snap-align', value); return this }
	/** ↕︎  */
	public VGridLines(start?: number, end?: number, endSpan?: boolean): this {
		if (start) this.styles.set('grid-row-start', start);
		if (end) this.styles.set('grid-row-end', endSpan ? 'span ' + end : end);
		return this
	}
	/** ↔︎ */
	public HGridLines(start?: number, end?: number, endSpan?: boolean): this {
		if (start) this.styles.set('grid-column-start', start);
		if (end) this.styles.set('grid-column-end', endSpan ? 'span ' + end : end);
		return this
	}












	// animation
	public animationCreate(value: ((coordinates: () => DOMRect) => UIAnimationClass<AnimationResize.create>) | undefined): this { this.animations.created = value; return this }
	public animationDestroy(value: ((coordinates: () => DOMRect) => UIAnimationClass<AnimationResize.destroy>) | undefined): this { this.animations.destroyed = value; return this }
	/**
	 * @param {number} duration ms
	 * @param {number} delay ms
	 * @description 1000ms = 1s
	 */
	public transition(duration: number, timingFunction?: TimingFunction | CubicBezier, delay?: number): this {
		this.styles
			.set('transition-property', 'all')
			.set('transition-duration', duration.toString() + 'ms');
		if (delay) this.styles.set('transition-delay', delay.toString() + 'ms');
		if (timingFunction) this.styles.set('transition-timing-function', timingFunction);
		return this
	}
	// /** @deprecated */
	// public transitionTimingFunction(value: TimingFunction | CubicBezier): this { this.styles.set('transition-timing-function', value); return this }








	// shadow
	public dropShadowOffsetX(value: number, unit = Units.px): this { this.styles.getCollectableStyles('filter', FiltersStyle).getCollectableStyles('drop-shadow', DropShadowStyle)['offset-x'] = value + unit; return this }
	public dropShadowOffsetY(value: number, unit = Units.px): this { this.styles.getCollectableStyles('filter', FiltersStyle).getCollectableStyles('drop-shadow', DropShadowStyle)['offset-y'] = value + unit; return this }
	public dropShadowBlurRadius(value: number, unit = Units.px): this { this.styles.getCollectableStyles('filter', FiltersStyle).getCollectableStyles('drop-shadow', DropShadowStyle)['blur-radius'] = value + unit; return this }
	public dropShadowColor(value: Color): this { this.styles.getCollectableStyles('filter', FiltersStyle).getCollectableStyles('drop-shadow', DropShadowStyle)['color'] = value; return this }
	public innerShadowOffsetX(value: number, unit = Units.px): this { this.styles.getCollectableStyles('box-shadow', InnerShadowStyle)['offset-x'] = value + unit; return this }
	public innerShadowOffsetY(value: number, unit = Units.px): this { this.styles.getCollectableStyles('box-shadow', InnerShadowStyle)['offset-y'] = value + unit; return this }
	public innerShadowBlurRadius(value: number, unit = Units.px): this { this.styles.getCollectableStyles('box-shadow', InnerShadowStyle)['blur-radius'] = value + unit; return this }
	public innerShadowColor(value: Color): this { this.styles.getCollectableStyles('box-shadow', InnerShadowStyle)['color'] = value; return this }







	protected setFilterPrefix(property: keyof FilterStyleInterface, backdrop: boolean, value: string | number): this {
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
	public perspective(value: number, unit = Units.px): this { this.styles.set('perspective', value + unit); return this }
	public blurEffect(value: number, unit = Units.px, backdrop: boolean = false): this { return this.setFilterPrefix('blur', backdrop, value + unit) }
	public brightnessEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('brightness', backdrop, value) }
	public contrastEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('contrast', backdrop, value) }
	public grayscaleEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('grayscale', backdrop, value) }
	public hueRotateEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('hueRotate', backdrop, value.toString() + 'deg') }
	public invertEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('invert', backdrop, value) }
	public saturateEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('saturate', backdrop, value) }
	public sepiaEffect(value: number, backdrop: boolean = false): this { return this.setFilterPrefix('sepia', backdrop, value) }
	/** @param value 0.0...1.0 */
	public opacityEffect(value: number, backdrop: boolean = false): this { if (backdrop) this.setFilterPrefix('opacity', backdrop, value); else this.styles.set('opacity', value); return this }
	// matrix | matrix3d
	/**   */ public rotateXEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('rotateX', value.toString() + 'deg'); return this }
	/**   */ public rotateYEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('rotateY', value.toString() + 'deg'); return this }
	/**   */ public rotateZEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('rotateZ', value.toString() + 'deg'); return this }
	/** ↔︎ */ public scaleXEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('scaleX', value); return this }
	/** ↕︎ */ public scaleYEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('scaleY', value); return this }
	/** ↘︎ */ public scaleZEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('scaleZ', value); return this }
	/**   */ public skewXEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('skewX', value.toString() + 'deg'); return this }
	/**   */ public skewYEffect(value: number): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('skewY', value.toString() + 'deg'); return this }
	/** ↔︎ */ public translateXEffect(value: number, unit = Units.absolute): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('translateX', value + unit); return this }
	/** ↕︎ */ public translateYEffect(value: number, unit = Units.absolute): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('translateY', value + unit); return this }
	/** ↘︎ */ public translateZEffect(value: number, unit = Units.px): this { this.styles.getCollectableStyles('transform', TransformsStyle).set('translateZ', value + unit); return this }












	// Listner
	/** @param threshold range 0.0...1.0 */
	public onScrollIntersection(...threshold: number[]): (value: (element: this, intersectionRatio: number, coordinates: DOMRect) => void) => this {
		return value => {
			let observer = this.safeScrollObserver
			observer.threshold = threshold;
			observer.userHandler = (ration, coords) => value(this, ration, coords);
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
	public popoverOnClink<V extends new (...p: any) => View>(view: V, value: (dismiss: () => void, coordinates: () => DOMRect) => [...ConstructorParameters<V>]): this {
		this.safeListeners.set('click', (element: HTMLElement) => {
			let popover = new PopoverData(view);
			popover.data = value(() => popover.destroy(), () => element.getBoundingClientRect());
			popover.render()
		})
		return this
	}
	public onClink(value: (element: this, coordinates: () => DOMRect) => void): this { this.safeListeners.set('click', (element: HTMLElement) => value(this, () => element.getBoundingClientRect())); return this }
	public onHover(value: (over: boolean, element: this) => void): this {
		this.safeListeners.set('mouseenter', () => value(true, this));
		this.safeListeners.set('mouseleave', () => value(false, this));
		return this
	}
	/** set onfocus listners and add tabindex 0 */
	public onFocus(value: (isFocused: boolean, element: this) => void, tabindex: number = 0): this {
		this.safeAttribute.set('tabindex', tabindex);
		this.safeListeners.set('focusin', () => value(true, this));
		this.safeListeners.set('focusout', () => value(false, this));
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
	// public onDoubleClick(value?: Listeners['doubleClick']): this { this.listeners.doubleClick = value; return this }
	// public onContextMenu(value?: Listeners['contextMenu']): this { this.listeners.contextMenu = value; return this }




















	public render(newRender?: ViewModifiers<any>, withAnimatiom?: boolean): HTMLElement {
		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			this.HTMLElement = this.generateHTMLElement();
			let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;
			this.renderModifiers(element, undefined, withAnimatiom);
			return element
		}

		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;
		// not update
		if (!newRender) { this.update(this.HTMLElement); return element }

		// update
		if (this.merge) this.merge(newRender, this.HTMLElement);
		this.renderModifiers(element, newRender, withAnimatiom);
		return element;
	}

	public destroy(withAnimatiom?: boolean): Promise<void> | void {
		if (!this.HTMLElement) return
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;

		if (withAnimatiom) return this.animations.animateDestruction(element)?.then(() => { element.remove(); this.HTMLElement = undefined })
		element.remove();
		this.HTMLElement = undefined
		return

	}
}