import { Observed } from "../Observed";



function init(): HTMLMetaElement {
	let element = document.querySelector<HTMLMetaElement>('meta[name=viewport]');
	if (!element) {
		element = document.createElement('meta');
		element.content = 'width=device-width, initial-scale=1';
		document.body.appendChild(element)
	} //else if(element.content != 'width=device-width, initial-scale=1') 
	return element
}

if (document.readyState != 'complete') window.addEventListener('load', () => init(), { once: true })
else init()











export class PageDataWidthClass extends Observed.LightObserver {
	protected timeoutID?: number

	public value: number = window.innerWidth

	public safeAreaInsetTop: number = 0
	public safeAreaInsetRight: number = 0
	public safeAreaInsetBottom: number = 0
	public safeAreaInsetLeft: number = 0


	public fitViewport(): void {
		let element = document.querySelector<HTMLMetaElement>('meta[name=viewport]');
		if (!element) element = init();
		if (!element.content.includes('viewport-fit=cover')) element.content += ' ,viewport-fit=cover';
	}




	protected mainHandler(): void {
		if (this.value == window.innerWidth) return
		clearTimeout(this.timeoutID);
		this.timeoutID = setTimeout(() => {
			this.setSafeArea();
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

	constructor() {
		super();
		window.addEventListener('resize', () => this.mainHandler(), { passive: true });
		window.addEventListener('orientationchange', () => this.mainHandler(), { passive: true });

		if (document.readyState != 'complete') window.addEventListener('load', () => this.setSafeArea(), { once: true })
		else this.setSafeArea()

	}
}
export const PageDataWidth = new PageDataWidthClass;