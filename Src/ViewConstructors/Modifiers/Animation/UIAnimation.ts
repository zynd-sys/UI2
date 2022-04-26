import type { TimingFunction } from 'Enum/TimingFunction';
import type { CSSCubicBezier } from 'CSS/CSSCubicBezier';
import type { FitPositionStyle } from '../CollectableStyles/FitPosition';
import type { Color } from 'Colors';
import type { Path } from 'Elements/Shapes/Path';
import type { CSSStepTimingFunction } from 'CSS/CSSStepTimingFunction';
import { Units } from 'Enum/Units';
import { AnimationResize } from 'Enum/AnimationResize';
import { FiltersStyle, FilterStyleInterface } from '../CollectableStyles/FiltersStyle';
import { TransformsStyle, TransformStyleInterface } from '../CollectableStyles/TransformsStyle';





interface AnimatedStyles {
	'transform'?: (TransformsStyle | string)[]
	'filter'?: (FiltersStyle | string)[]


	// 'border-width'?: (SideStyle | undefined)[]
	'borderRadius'?: string[]
	'borderColor'?: Color[]
	'borderStyle'?: string[]

	'clipPath'?: Path[]

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

interface s {
	transform: TransformStyleInterface
	filter: FilterStyleInterface
}




class AnimationStorageClass {
	protected storage: Set<Element> = new Set;
	protected completionStorage: Map<object, () => void> = new Map;

	protected mainHandler(element: Element) {
		this.storage.delete(element);

		if (this.storage.size == 0) {
			this.completionStorage.forEach(v => v());
			this.completionStorage.clear()
		}
	}




	public addAnimation(element: Element, promise: Promise<void>): void {
		if (!this.storage.has(element)) this.storage.add(element);
		else return console.error('replace animation', element);

		promise.then(() => this.mainHandler(element))
	}
	public addAnimationCompletionHandler(object: object): Promise<void>
	public addAnimationCompletionHandler(object: object, handler: () => void): void
	public addAnimationCompletionHandler(object: object, handler?: () => void): void | Promise<void> {
		if (this.storage.size == 0) return handler ? handler() : Promise.resolve();

		if (handler) this.completionStorage.set(object, handler)
		else new Promise<void>(resolve => this.completionStorage.set(object, () => this.completionStorage.set(object, resolve)))
	}


	public checkOutAnimation(element: Element): boolean { return this.storage.has(element) }
	public get isAnimated(): boolean { return this.storage.size != 0 }
}


export const AnimationStorage = new AnimationStorageClass;














export class UIAnimationClass {

	protected options: KeyframeAnimationOptions = { composite: 'replace', fill: 'backwards' }
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

	public clipPath(...values: [from: Path, to: Path, ...otherValues: Path[]]): this { this.keyFrames.clipPath = values; return this }

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


	public borderRadius(units: Units, ...values: [from: number, to: number, ...otherValues: number[]]): this { this.keyFrames.borderRadius = values.map(v => v.toString() + units); return this }


	public popoverEffect(fromElement: DOMRect, toElement: DOMRect, animateResize: AnimationResize): this {
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
	public transformOrigin(horizontal: number, vertical: number): this {
		this.keyFrames.transformOriginX = [horizontal + '%', horizontal + '%'];
		this.keyFrames.transformOriginY = [vertical + '%', vertical + '%'];
		let frame = `${horizontal}% ${vertical}%`;
		this.keyFrames.transformOrigin = [frame, frame];
		return this
	}


	// public customStyleProperty<P extends keyof OmitAnimatedStyles>(styleName: P, ...values: [from: ValueStyle<P>, to: ValueStyle<P>, ...otherValues: ValueStyle<P>[]]): this { this.keyFrames[styleName] = values; return this }



	/** @param value milliseconds */
	public animationDelay(value: number): this { this.options.delay = value; return this }
	/** @param value defualt true  */
	public animationReverseDirectionEachCycle(value: boolean = true): this { this.options.direction = value ? 'alternate' : 'normal'; return this }
	public animationTimingFunction(timingFunction: TimingFunction | CSSCubicBezier | CSSStepTimingFunction): this { this.options.easing = timingFunction.toString(); return this }
	// /** @param value number or Infinity */
	// public animationIterations(value: number): this { this.options.iterations = value; return this }






















	public animate(element: HTMLElement, trackAnimation: boolean = true): Promise<void> {
		let animation = element.animate(this.keyFrames as unknown as PropertyIndexedKeyframes, this.options);
		let p = animation.finished.then<void>();

		if (trackAnimation) AnimationStorage.addAnimation(element, p);
		return p
	}



	/** @param duration milliseconds */
	constructor(duration: number) { this.options.duration = duration }
}

/** @param duration milliseconds */
export function UIAnimation(duration: number): UIAnimationClass { return new UIAnimationClass(duration) }