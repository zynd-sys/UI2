import type { CSSLength, StylesInterface } from '../../Styles/CSS/Types';
import { MainStyleSheet, CSSSelectore } from '../../Styles/CSS';
import { LightObserver } from '../../Data/Observed';



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




const viewportCoverRegexp = /viewport-fit\s*=\s*cover/

export class PageDataWidthClass extends LightObserver {
	protected timeoutID?: number
	protected isViewportCover: boolean = false

	protected computedStyles: CSSStyleDeclaration = window.getComputedStyle(document.documentElement);

	protected setupMetaTag(name: string, content: string, searchWithoutContent?: boolean): HTMLMetaElement {
		let element = document.head.querySelector<HTMLMetaElement>(searchWithoutContent ? `meta[name='${name}']` : `meta[name='${name}'][content='${content}']`);
		if (element) return element

		element = document.head.appendChild(document.createElement('meta'));
		element.name = name;
		element.content = content;
		return element
	}





	public orientationPortrait: boolean = window.matchMedia('(orientation: portrait)').matches
	public value: number = window.innerWidth

	public safeAreaInsetTop: number = 0
	public safeAreaInsetRight: number = 0
	public safeAreaInsetBottom: number = 0
	public safeAreaInsetLeft: number = 0



	public setViewportCover(): void {
		if (this.isViewportCover) return
		let element = this.setupMetaTag('viewport', 'width=device-width, initial-scale=1');
		element.content += ' ,viewport-fit=cover';
		this.isViewportCover = true;
		this.setSafeArea();
	}
	/** @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html */
	public appleWebAppStatusBarStyleTranslucent(): void { this.setupMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent') }
	/** @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html */
	public disableFormatDetection(): void { this.setupMetaTag('format-detection', 'telephone=no') }







	protected mainHandler(): void {
		if (this.value == window.innerWidth) return
		clearTimeout(this.timeoutID);
		this.timeoutID = setTimeout(() => {
			if (this.isViewportCover) this.setSafeArea();
			this.action('value', window.innerWidth);
		}, 350);
	}


	protected setSafeArea(): void {
		this.safeAreaInsetTop = parseInt(this.computedStyles.getPropertyValue('--safe-area-inset-top'));
		this.safeAreaInsetRight = parseInt(this.computedStyles.getPropertyValue('--safe-area-inset-right'));
		this.safeAreaInsetBottom = parseInt(this.computedStyles.getPropertyValue('--safe-area-inset-bottom'));
		this.safeAreaInsetLeft = parseInt(this.computedStyles.getPropertyValue('--safe-area-inset-left'));
	}



	protected init(): void {
		if (viewportCoverRegexp.test(this.setupMetaTag('viewport', 'width=device-width, initial-scale=1').content)) this.isViewportCover = true;
		if (this.isViewportCover) this.setSafeArea();
	}

	constructor() {
		super();
		window.addEventListener('resize', () => this.mainHandler(), { passive: true });
		window.addEventListener('orientationchange', () => { this.orientationPortrait = !this.orientationPortrait; this.mainHandler() }, { passive: true });

		if (document.readyState != 'complete') window.addEventListener('load', () => this.init(), { once: true })
		else this.init()

	}
}
export const PageDataWidth = new PageDataWidthClass;