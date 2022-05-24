import { PageDataColorModeClass } from './PageDataColorMode'
import { PageDataWidthClass } from './PageDataWidth'
import { LightObserver } from '../Observed'



export class PageDataClass extends LightObserver {
	public readonly reducedAnimation: boolean
	public readonly isTouch: boolean
	public readonly isNetworkOnline: boolean = window.navigator.onLine
	public readonly isFullscreenMode: boolean = window.matchMedia('(display-mode: fullscreen) or (minimal-ui)').matches || window.navigator.standalone || false
	public readonly installAppEvent?: BeforeInstallPromptEvent

	public readonly windowSize!: PageDataWidthClass
	public readonly globalColors!: PageDataColorModeClass


	constructor() {
		super();

		this.action('windowSize', new PageDataWidthClass)
		this.action('globalColors', new PageDataColorModeClass)

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

	}
}


export const PageData: PageDataClass = new PageDataClass;