import type { TimingFunction } from '../Styles/CSS'
import type { CSSCubicBezier } from '../Styles/CSS/CollectableStyles/CSSCubicBezier'
import type { CSSStepTimingFunction } from '../Styles/CSS/CollectableStyles/CSSStepTimingFunction'
import { EnvironmentMetaDescription } from './EnvironmentMetaDescription'




export class EnvironmentPageData extends EnvironmentMetaDescription {
	private reducedAnimationValue: boolean
	public get reducedAnimation(): boolean { return this.reducedAnimationValue }

	public isTouch: boolean
	public isNetworkOnline: boolean = window.navigator.onLine
	public readonly globalIsFullscreenMode!: boolean

	private globalInstallAppEventValue?: BeforeInstallPromptEvent
	public get globalInstallAppEvent(): BeforeInstallPromptEvent | undefined { return this.globalInstallAppEventValue }



	private formatDetectionValue: boolean = true
	private formatDetectionElement: HTMLMetaElement | { content: string } = { content: '' }
	/** @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html */
	public get formatDetection(): boolean { return this.formatDetectionValue }
	public set formatDetection(value) { this.formatDetectionElement.content = `telephone=${value ? 'yes' : 'no'}`; this.formatDetectionValue = value }



	public useTransitions: boolean = false
	/** `ms` default `300` */
	public defaultTransitionDurations: number = 300
	public defaultTransitionTimingFunction?: TimingFunction | CSSCubicBezier | CSSStepTimingFunction
	/** `ms` */
	public defaultTransitionDelay?: number



	constructor() {
		super();

		this.readonlyEnvironment('globalIsFullscreenMode', window.matchMedia('(display-mode: fullscreen) or (minimal-ui)').matches || window.navigator.standalone || false)

		window.addEventListener('offline', () => this.action('isNetworkOnline', false));
		window.addEventListener('online', () => this.action('isNetworkOnline', true));

		let mediaQHover = window.matchMedia('(hover: hover)');
		this.isTouch = !mediaQHover.matches;
		mediaQHover.addEventListener('change', event => this.action('isTouch', !event.matches));

		window.addEventListener('beforeinstallprompt', event => {
			event.preventDefault();
			this.action('globalInstallAppEventValue' as any, event)
		})
		window.addEventListener('appinstalled', () => { if (this.globalInstallAppEventValue) this.action('globalInstallAppEvent', undefined) })

		let mediaQreducedAnimation = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.reducedAnimationValue = mediaQreducedAnimation.matches;
		mediaQreducedAnimation.addEventListener('change', event => this.action('reducedAnimationValue' as any, event.matches));

		this.findOrCreateElement('meta', 'name', 'format-detection', element => {
			element.content = this.formatDetectionElement.content
			this.formatDetectionElement = element;
		})

	}
}


