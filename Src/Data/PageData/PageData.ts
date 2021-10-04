import { Observed } from "../Observed"



export class PageDataClass extends Observed.LightObserver {
	public readonly isTouch: boolean
	public readonly network: boolean = navigator.onLine
	public readonly isApp: boolean = window.matchMedia('(display-mode: fullscreen)').matches

	// public orientationPortrait: boolean

	constructor() {
		super();

		window.addEventListener('offline', () => this.action('network', false));
		window.addEventListener('online', () => this.action('network', true));

		let mediaQHover = window.matchMedia('(hover: hover)');
		this.isTouch = !mediaQHover.matches;
		mediaQHover.addEventListener('change', event => this.action('isTouch', !event.matches));

		// let deviceOrientation = window.matchMedia('(orientation: portrait)');
		// this.orientationPortrait = deviceOrientation.matches;
		// deviceOrientation.addEventListener('change', event => this.orientationPortrait = event.matches);
	}
}
export const PageData: PageDataClass = new PageDataClass;