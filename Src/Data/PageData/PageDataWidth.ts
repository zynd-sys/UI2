import { LightObserver } from "../Observed";













export class PageDataWidthClass extends LightObserver {
	protected timeoutID?: number
	protected isViewportCover: boolean = false
	protected viewportCoverRegexp: RegExp = /viewport-fit\s*=\s*cover/

	public value: number = window.innerWidth

	public safeAreaInsetTop: number = 0
	public safeAreaInsetRight: number = 0
	public safeAreaInsetBottom: number = 0
	public safeAreaInsetLeft: number = 0

	public orientationPortrait: boolean = window.matchMedia('(orientation: portrait)').matches


	public setViewportCover(): void {
		if(this.isViewportCover) return
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
		const styles = window.getComputedStyle(document.body);
		this.safeAreaInsetTop = parseInt(styles.getPropertyValue('--safe-area-inset-top'));
		this.safeAreaInsetRight = parseInt(styles.getPropertyValue('--safe-area-inset-right'));
		this.safeAreaInsetBottom = parseInt(styles.getPropertyValue('--safe-area-inset-bottom'));
		this.safeAreaInsetLeft = parseInt(styles.getPropertyValue('--safe-area-inset-left'));
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