import type { StylesInterface } from "CSS/Types/StylesInterface";
import type { CSSLength } from "CSS/Types/MinimalStylesType";
import { LightObserver } from "../Observed";
import { CSSSelectore } from "CSS/CSSSelectore";
import { MainStyleSheet } from "CSS/MainStyleSheet";



type CSSEnvFunction = `env(safe-area-inset-${'top' | 'bottom' | 'left' | 'right'})` | `env(safe-area-inset-${'top' | 'bottom' | 'left' | 'right'},${CSSLength})`

interface PageDataStyles extends StylesInterface {
	'--safe-area-inset-top'?: CSSEnvFunction,
	'--safe-area-inset-right'?: CSSEnvFunction,
	'--safe-area-inset-bottom'?: CSSEnvFunction,
	'--safe-area-inset-left'?: CSSEnvFunction
}



MainStyleSheet.add(new CSSSelectore<PageDataStyles>('body', {
	'--safe-area-inset-top': 'env(safe-area-inset-top,0)',
	'--safe-area-inset-right': 'env(safe-area-inset-right,0)',
	'--safe-area-inset-bottom': 'env(safe-area-inset-bottom,0)',
	'--safe-area-inset-left': 'env(safe-area-inset-left,0)'
}))



export class PageDataWidthClass extends LightObserver {
	protected timeoutID?: number
	protected isViewportCover: boolean = false
	protected viewportCoverRegexp: RegExp = /viewport-fit\s*=\s*cover/

	protected computedStyles?: CSSStyleDeclaration
	protected get computedStylesSafe(): CSSStyleDeclaration { return this.computedStyles ? this.computedStyles : this.computedStyles = window.getComputedStyle(document.body) }

	public value: number = window.innerWidth

	public safeAreaInsetTop: number = 0
	public safeAreaInsetRight: number = 0
	public safeAreaInsetBottom: number = 0
	public safeAreaInsetLeft: number = 0

	public orientationPortrait: boolean = window.matchMedia('(orientation: portrait)').matches


	public setViewportCover(): void {
		if (this.isViewportCover) return
		let element = this.getMetaViewportElement();
		element.content += ' ,viewport-fit=cover';
		this.isViewportCover = true;
		this.setSafeArea();
	}




	protected mainHandler(): void {
		if (this.value == window.innerWidth) return
		clearTimeout(this.timeoutID);
		this.timeoutID = setTimeout(() => {
			if (this.isViewportCover) this.setSafeArea();
			this.action('value', window.innerWidth);
		}, 350);
	}


	protected setSafeArea(): void {
		this.safeAreaInsetTop = parseInt(this.computedStylesSafe.getPropertyValue('--safe-area-inset-top'));
		this.safeAreaInsetRight = parseInt(this.computedStylesSafe.getPropertyValue('--safe-area-inset-right'));
		this.safeAreaInsetBottom = parseInt(this.computedStylesSafe.getPropertyValue('--safe-area-inset-bottom'));
		this.safeAreaInsetLeft = parseInt(this.computedStylesSafe.getPropertyValue('--safe-area-inset-left'));
	}


	protected getMetaViewportElement(): HTMLMetaElement {
		let element = document.querySelector<HTMLMetaElement>('meta[name=viewport]');
		if (!element) {
			element = document.createElement('meta');
			element.content = 'width=device-width, initial-scale=1';
			document.body.appendChild(element)
		}
		return element
	}
	protected init(): void {
		if (this.viewportCoverRegexp.test(this.getMetaViewportElement().content)) this.isViewportCover = true;
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