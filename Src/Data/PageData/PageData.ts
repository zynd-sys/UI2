import { Observed } from "../Observed"



export class PageDataClass extends Observed.Objects {
	public isTouch: boolean
	public network: boolean = navigator.onLine
	public isApp: boolean = window.matchMedia('(display-mode: fullscreen)').matches
	
	// public orientationPortrait: boolean

	constructor() {
		super();

		window.addEventListener('offline', () => this.network = false);
		window.addEventListener('online', () => this.network = true);

		let mediaQHover = window.matchMedia('(hover: hover)');
		this.isTouch = !mediaQHover.matches;
		mediaQHover.addEventListener('change', event => this.hoverStatus = !event.matches)

		// let deviceOrientation = window.matchMedia('(orientation: portrait)');
		// this.orientationPortrait = deviceOrientation.matches;
		// deviceOrientation.addEventListener('change', event => this.orientationPortrait = event.matches);
	}
}
export const PageData: PageDataClass = new PageDataClass;




// export class PageDataScrollClass extends Observed.LightObserver {
// 	protected handlerCount = 0;
// 	protected isListen: boolean = false

// 	public value: number = window.pageYOffset

// 	public addHandler(...v: Parameters<Observed.LightObserver['addHandler']>): ReturnType<Observed.LightObserver['addHandler']> {
// 		++this.handlerCount;
// 		this.checkHandler();
// 		return super.addHandler(...v)
// 	}
// 	public removeHandler(...v: Parameters<Observed.LightObserver['removeHandler']>): ReturnType<Observed.LightObserver['removeHandler']> {
// 		--this.handlerCount;
// 		this.checkHandler();
// 		return super.removeHandler(...v)
// 	}
// 	public addBeacon(...v: Parameters<Observed.LightObserver['addBeacon']>): ReturnType<Observed.LightObserver['addBeacon']> {
// 		++this.handlerCount;
// 		this.checkHandler();
// 		return super.addBeacon(...v)
// 	}
// 	public removeBeacon(...v: Parameters<Observed.LightObserver['removeBeacon']>): ReturnType<Observed.LightObserver['removeBeacon']> {
// 		--this.handlerCount;
// 		this.checkHandler();
// 		return super.removeBeacon(...v)
// 	}


// 	protected mainHandler = () => this.action('value', window.pageYOffset)
// 	protected checkHandler() {
// 		if (this.handlerCount == 0 && this.isListen) {
// 			window.removeEventListener('scroll', this.mainHandler);
// 			return
// 		}
// 		if (this.handlerCount > 0 && this.isListen == false) {
// 			window.addEventListener('scroll', this.mainHandler, { passive: true })
// 			return
// 		}
// 	}
// }
// export const PageDataScroll: PageDataScrollClass = new PageDataScrollClass;


