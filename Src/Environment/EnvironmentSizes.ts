import type { CSSLength, StylesInterface } from '../Styles/CSS/Types';
import { CSSSelectore, MainStyleSheet } from '../Styles/CSS';
import { EnvironmentPageData } from './EnvironmentPageData';




type CSSEnvFunction = `env(safe-area-inset-${'top' | 'bottom' | 'left' | 'right'})` | `env(safe-area-inset-${'top' | 'bottom' | 'left' | 'right'},${CSSLength})`

interface PageDataStyles extends StylesInterface {
	'--safe-area-inset-top'?: CSSEnvFunction,
	'--safe-area-inset-right'?: CSSEnvFunction,
	'--safe-area-inset-bottom'?: CSSEnvFunction,
	'--safe-area-inset-left'?: CSSEnvFunction
}



MainStyleSheet.add(new CSSSelectore<PageDataStyles>(':root', {
	'--safe-area-inset-top': 'env(safe-area-inset-top,0)',
	'--safe-area-inset-right': 'env(safe-area-inset-right,0)',
	'--safe-area-inset-bottom': 'env(safe-area-inset-bottom,0)',
	'--safe-area-inset-left': 'env(safe-area-inset-left,0)'
}))




const viewportCoverRegexp = /viewport-fit\s*=\s*cover/;
const viewportinitialScaleRegexp = /initial-scale\s*?=\s*?1/;
const viewportWidth = /width\s*?=\s*?device-width/;

export class EnvironmentSizes extends EnvironmentPageData {
	private timeoutID?: number
	private computedStyles: CSSStyleDeclaration = window.getComputedStyle(document.documentElement);





	public orientationPortrait: boolean = window.matchMedia('(orientation: portrait)').matches
	public windowWidth: number = window.innerWidth

	public safeAreaInsetTop: number = 0
	public safeAreaInsetRight: number = 0
	public safeAreaInsetBottom: number = 0
	public safeAreaInsetLeft: number = 0





	private isViewportCover: boolean = false
	private viewportElement: HTMLMetaElement | { content: string } = { content: '' }

	public get viewportCover(): boolean { return this.isViewportCover }
	public set viewportCover(value: boolean) {
		if (value) if (!viewportCoverRegexp.test(this.viewportElement.content)) this.viewportElement.content += ',viewport-fit=cover';
		else if(viewportCoverRegexp.test(this.viewportElement.content)) this.viewportElement.content = this.viewportElement.content.replace(viewportCoverRegexp, '');
		this.isViewportCover = value;
	}


	private statusBarValue: boolean = false
	private statusBarMetaElement: HTMLMetaElement | { content: string } = { content: 'default' }
	/** @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html */
	public get appleWebAppStatusBarStyleTranslucent(): boolean { return this.statusBarValue }
	public set appleWebAppStatusBarStyleTranslucent(value: boolean) {
		if (value == this.statusBarValue) return;

		if (value) this.statusBarMetaElement.content = 'black-translucent';
		else this.statusBarMetaElement.content = 'default';

		this.statusBarValue = value;
	}











	private setSafeArea(): void {
		this.safeAreaInsetTop = parseInt(this.computedStyles.getPropertyValue('--safe-area-inset-top'));
		this.safeAreaInsetRight = parseInt(this.computedStyles.getPropertyValue('--safe-area-inset-right'));
		this.safeAreaInsetBottom = parseInt(this.computedStyles.getPropertyValue('--safe-area-inset-bottom'));
		this.safeAreaInsetLeft = parseInt(this.computedStyles.getPropertyValue('--safe-area-inset-left'));
	}




	private mainHandler(): void {
		if (this.windowWidth == window.innerWidth) return
		clearTimeout(this.timeoutID);
		this.timeoutID = setTimeout(() => {
			this.setSafeArea();
			this.action('windowWidth', window.innerWidth);
		}, 350);
	}

	constructor() {
		super();
		window.addEventListener('resize', () => this.mainHandler(), { passive: true });
		window.addEventListener('orientationchange', () => { this.orientationPortrait = !this.orientationPortrait; this.mainHandler() }, { passive: true });

		this
			.findOrCreateElement('meta', 'name', 'apple-mobile-web-app-status-bar-style', element => {
				this.statusBarMetaElement.content = element.content;
				this.statusBarMetaElement = element;
			})
			.findOrCreateElement('meta', 'name', 'viewport', element => {
				if (!viewportinitialScaleRegexp.test(element.content)) element.content += ',initial-scale=1';
				if (!viewportWidth.test(element.content)) element.content += ',width=device-width';

				if (viewportCoverRegexp.test(element.content)) this.isViewportCover = true;
				else if (this.isViewportCover) element.content += ',viewport-fit=cover';

				this.setSafeArea();

				this.viewportElement = element;
			})
	}
}



