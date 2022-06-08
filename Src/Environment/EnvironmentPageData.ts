import { EnvironmentMetaDescription } from "./EnvironmentMetaDescription"




export class EnvironmentPageData extends EnvironmentMetaDescription {
	public readonly reducedAnimation: boolean

	public readonly isTouch: boolean
	public readonly isNetworkOnline: boolean = window.navigator.onLine
	public readonly isFullscreenMode: boolean = window.matchMedia('(display-mode: fullscreen) or (minimal-ui)').matches || window.navigator.standalone || false
	public readonly installAppEvent?: BeforeInstallPromptEvent



	private formatDetectionValue: boolean = true
	private formatDetectionElement: HTMLMetaElement | { content: string } = { content: '' }
	/** @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html */
	public get formatDetection(): boolean { return this.formatDetectionValue }
	public set formatDetection(value) { this.formatDetectionElement.content = `telephone=${value ? 'yes' : 'no'}`; this.formatDetectionValue = value }


	constructor() {
		super();

		window.addEventListener('offline', () => this.action('isNetworkOnline', false));
		window.addEventListener('online', () => this.action('isNetworkOnline', true));

		let mediaQHover = window.matchMedia('(hover: hover)');
		this.isTouch = !mediaQHover.matches;
		mediaQHover.addEventListener('change', event => this.action('isTouch', !event.matches));

		window.addEventListener('beforeinstallprompt', event => {
			event.preventDefault();
			this.action('installAppEvent', event)
		})
		window.addEventListener('appinstalled', () => { if (this.installAppEvent) this.action('installAppEvent', undefined) })

		let mediaQreducedAnimation = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.reducedAnimation = mediaQreducedAnimation.matches;
		mediaQreducedAnimation.addEventListener('change', event => this.action('reducedAnimation', event.matches));

		this.findOrCreateElement('meta', 'name', 'format-detection', element => {
			element.content = this.formatDetectionElement.content
			this.formatDetectionElement = element;
		})

	}
}


