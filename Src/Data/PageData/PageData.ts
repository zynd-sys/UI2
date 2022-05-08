import { PrefersReducedMotionCSSMedia, PrefersReducedMotionValue } from '../../ViewConstructors/Modifiers/Animation/PrefersReducedMotionCSSMedia'
import { LightObserver } from '../Observed'



export class PageDataClass extends LightObserver {
	public readonly reducedAnimation: boolean
	public readonly isTouch: boolean
	public readonly network: boolean = navigator.onLine
	public readonly isApp: boolean = window.matchMedia('(display-mode: fullscreen)').matches

	constructor() {
		super();

		window.addEventListener('offline', () => this.action('network', false));
		window.addEventListener('online', () => this.action('network', true));

		let mediaQHover = window.matchMedia('(hover: hover)');
		this.isTouch = !mediaQHover.matches;
		mediaQHover.addEventListener('change', event => this.action('isTouch', !event.matches));

		this.reducedAnimation = PrefersReducedMotionValue;
		PrefersReducedMotionCSSMedia.addEventListener('change', event => this.action('reducedAnimation', event.matches))
	}
}
export const PageData: PageDataClass = new PageDataClass;