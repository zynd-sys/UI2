import type { TimingFunction } from "../../Enum/TimingFunction";
import type { CubicBezier } from "./CubicBezier";
import type { FitPositionStyle } from "../CollectableStyles/FitPosition";
import type { Color } from "../Colors/Colors";
import { Units } from "../../Enum/Units";
import { AnimationResize } from "../../Enum/AnimationResize";
import { FiltersStyle, FilterStyleInterface } from "../CollectableStyles/FiltersStyle";
import { TransformsStyle, TransformStyleInterface } from "../CollectableStyles/TransformsStyle";
import { AnimationStorage } from "../../../Data/Storages/Animations";





export interface AnimatedStyles {
	'transform'?: (TransformsStyle | string)[]
	'filter'?: (FiltersStyle | string)[]

	'minWidth'?: string[]
	'width'?: string[]

	'minHeight'?: string[]
	'height'?: string[]

	// 'flex-grow'?: (number | undefined)[]
	'padding'?: string[]
	'margin'?: string[]

	// 'border-width'?: (SideStyle | undefined)[]
	'borderRadius'?: string[]
	'borderColor'?: Color[]
	'borderStyle'?: string[]

	'left'?: string[]
	'top'?: string[]

	'backgroundColor'?: Color[]

	'objectPosition'?: FitPositionStyle[]

	'transformOrigin'?: string[]
	'transformOriginX'?: string[]
	'transformOriginY'?: string[]
	'overflow'?: 'hidden'


	'color'?: Color[]
	'fontSize'?: string[]
	'fontWeight'?: string[]
	'letterSpacing'?: string[]
	'lineHeight'?: string[]
}

type OmitAnimatedStyles = Omit<AnimatedStyles, 'transform' | 'filter' | 'width' | 'minWidth' | 'height' | 'minHeight' | 'margin' | 'padding' | 'overflow' | 'transformOrigin'>
type ValueStyle<P extends keyof OmitAnimatedStyles> = NonNullable<NonNullable<AnimatedStyles[P]>[any]>
interface s {
	transform: TransformStyleInterface
	filter: FilterStyleInterface
}
















export class UIAnimationClass<A extends AnimationResize> {

	protected options: { reSize?: AnimationResize } & KeyframeAnimationOptions = { composite: 'replace', fill: 'backwards' }
	protected keyFrames: AnimatedStyles = {}


	protected setCollectableStyles<S extends 'transform' | 'filter'>(style: S, property: keyof s[S], values: (string | number)[]): void {
		let object: ((TransformsStyle | string)[]) | ((FiltersStyle | string)[]) | undefined = this.keyFrames[style];
		if (!object) object = this.keyFrames[style] = [];

		values.forEach((value, i) => {
			let layer: string | TransformsStyle | FiltersStyle | undefined = object![i];
			if (typeof layer == 'string') return
			if (!layer) layer = object![i] = style == 'filter' ? new FiltersStyle : new TransformsStyle;

			// @ts-ignore
			layer.set(property, value)
		})

	}

	public blurEffect(units: Units, ...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'blur', values.map(v => v.toString() + units)); return this }
	public brightnessEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'brightness', values); return this }
	public contrastEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'contrast', values); return this }
	public grayscaleEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'grayscale', values); return this }
	public hueRotateEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'blur', values.map(v => v.toString() + 'deg')); return this }
	public invertEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'invert', values); return this }
	public opacityEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'opacity', values); return this }
	public saturateEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'saturate', values); return this }
	public sepiaEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('filter', 'sepia', values); return this }
	// matrix | matrix3d
	// perspective
	public rotateXEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'rotateX', values.map(v => v.toString() + 'deg')); return this }
	public rotateYEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'rotateY', values.map(v => v.toString() + 'deg')); return this }
	public rotateZEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'rotateZ', values.map(v => v.toString() + 'deg')); return this }
	/** ↔︎ */ public scaleXEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'scaleX', values); return this }
	/** ↕︎ */ public scaleYEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'scaleY', values); return this }
	/**   */ public scaleZEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'scaleZ', values); return this }
	public skewXEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'skewX', values.map(v => v.toString() + 'deg')); return this }
	public skewYEffect(...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'skewY', values.map(v => v.toString() + 'deg')); return this }
	public translateXEffect(units: Units, ...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'translateX', values.map(v => v.toString() + units)); return this }
	public translateYEffect(units: Units, ...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'translateY', values.map(v => v.toString() + units)); return this }
	public translateZEffect(units: Units, ...values: [from: number, to: number, ...otherValues: number[]]): this { this.setCollectableStyles('transform', 'translateZ', values.map(v => v.toString() + units)); return this }



	public popoverEffect(fromElement: DOMRect, toElement: DOMRect, animateResize: AnimationResize.create | AnimationResize.destroy): this {
		let x = -toElement.x - toElement.width / 2 + fromElement.x + fromElement.width / 2;
		let y = -toElement.y - toElement.height / 2 + fromElement.y + fromElement.height / 2;
		if (animateResize == AnimationResize.create) {
			this.translateXEffect(Units.px, x, 0)
				.translateYEffect(Units.px, y, 0)
				.scaleXEffect(fromElement.width / toElement.width, 1)
				.scaleYEffect(fromElement.height / toElement.height, 1)
		} else {
			this.translateXEffect(Units.px, 0, x)
				.translateYEffect(Units.px, 0, y)
				.scaleXEffect(1, fromElement.width / toElement.width)
				.scaleYEffect(1, fromElement.height / toElement.height)
		}
		return this
	}

	public backgroundColor(...values: [from: Color, to: Color, ...otherValues: Color[]]): this { this.keyFrames.backgroundColor = values; return this }


	/** 
	 * @param horizontal ↔︎ — % percentage
	 * @param vertical ↕︎ — % percentage
	 */
	// public transformOrigin(horizontal: number, vertical: number): this { let frame = `${horizontal}% ${vertical}%`; this.keyFrames.transformOrigin = [frame, frame]; return this }
	public transformOrigin(horizontal: number, vertical: number): this {
		this.keyFrames.transformOriginX = [horizontal + '%', horizontal + '%'];
		this.keyFrames.transformOriginY = [vertical + '%', vertical + '%'];
		let frame = `${horizontal}% ${vertical}%`;
		this.keyFrames.transformOrigin = [frame, frame];
		return this
	}

	// @ts-ignore
	public customStyleProperty<P extends keyof OmitAnimatedStyles>(styleName: P, ...values: [from: ValueStyle<P>, to: ValueStyle<P>, ...otherValues: ValueStyle<P>[]]): this { this.keyFrames[styleName] = values; return this }



	/** @param value milliseconds */
	public animationDelay(value: number): this { this.options.delay = value; return this }
	/** @param value defualt true  */
	public animationReverseDirectionEachCycle(value: boolean = true): this { if (value) this.options.direction = 'alternate'; return this }
	public animationTimingFunction(timingFunction: TimingFunction | CubicBezier): this { this.options.easing = timingFunction.toString(); return this }
	// /** @param value number or Infinity */
	// public animationIterations(value: number): this { this.options.iterations = value; return this }
















	protected getGeneralKeyFrames(keyFrames: AnimatedStyles) {
		if (keyFrames.filter) keyFrames.filter = keyFrames.filter.map(v => v.toString());
		if (keyFrames.transform) keyFrames.transform = keyFrames.transform.map(v => v.toString());
		return keyFrames
	}

	protected getKeyFrames(element: HTMLElement, revers?: boolean) {
		let keyFrames = Object.assign({ 'overflow': ['hidden', 'hidden'] }, this.keyFrames);

		const isRow = element.parentElement?.style.flexDirection == 'row';
		const isTextConteainer = element.classList.contains('text-conteainer');

		if (isRow || isTextConteainer) {
			keyFrames.minWidth = ['0', '0'];
			keyFrames.width = ['0', `${element.clientWidth}px`];
			if (revers) keyFrames.width.reverse();
		}
		if (!isRow || isTextConteainer) {
			keyFrames.minHeight = ['0', '0'];
			keyFrames.height = ['0', `${element.clientHeight}px`];
			if (revers) keyFrames.height.reverse();
		}

		if (element.style.margin) keyFrames.margin = ['0', element.style.margin];
		if (element.style.padding) keyFrames.padding = ['0', element.style.padding];
		if (revers) {
			keyFrames.margin?.reverse();
			keyFrames.padding?.reverse();
		}
		this.getGeneralKeyFrames(keyFrames);

		return keyFrames
	}

	protected setHandlers(animation: Animation, endHandler: () => void): void {
		const handler = () => { animation.oncancel = null; animation.onfinish = null; endHandler(); };
		animation.oncancel = handler;
		animation.onfinish = handler;
	}





	public animate(element: HTMLElement, track: boolean = true): Promise<void> {
		let promise: Promise<AnimatedStyles>;
		switch (this.options.reSize) {
			case AnimationResize.none: promise = Promise.resolve(this.getGeneralKeyFrames(Object.assign({}, this.keyFrames))); break;
			case AnimationResize.destroy: promise = Promise.resolve(this.getKeyFrames(element, true)); break;
			case AnimationResize.create:
				if (element.isConnected) promise = Promise.resolve(this.getKeyFrames(element))
				else promise = new Promise(resolve => window.requestAnimationFrame(() => resolve(this.getKeyFrames(element))))
				break;

			default: throw new Error('not found animation type ' + this.options.reSize)
		}

		let p = promise.then<void>(keyFrames => {
			let animation = element.animate(keyFrames as PropertyIndexedKeyframes, this.options);
			return new Promise(resolve => this.setHandlers(animation, resolve));
		})

		if (track) AnimationStorage.addAnimation(element, p);
		return p
	}



	/** @param duration milliseconds */
	constructor(duration: number, animateResize: A) { this.options.reSize = animateResize; this.options.duration = duration }
}

/** @param duration milliseconds */
export function UIAnimation<A extends AnimationResize>(duration: number, animateResize: A): UIAnimationClass<A> { return new UIAnimationClass(duration, animateResize) }