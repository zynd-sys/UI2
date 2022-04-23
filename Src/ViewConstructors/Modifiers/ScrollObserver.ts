import { SideStyle } from './CollectableStyles/SideStyle';



let HTMLElementDataStorage: WeakMap<HTMLElement, ScrollObserverStorage> = new WeakMap()


class ScrollObserverStorage {
	public userHandler: (intersectionRatio: number, coordinates: DOMRect) => void
	public observer: IntersectionObserver
	public threshold?: number | number[]
	public rootMargin?: SideStyle


	constructor(userHandler: (intersectionRatio: number, coordinates: DOMRect) => void, options: ScrollObserver) {
		this.userHandler = userHandler;
		let o: IntersectionObserverInit = {
			rootMargin: options.rootMargin?.toString().replace(/^0|\s0/g, ' 0px'),
			threshold: options.threshold
		};
		this.threshold = options.threshold;
		this.rootMargin = options.rootMargin;
		this.observer = new IntersectionObserver(e => this.userHandler(e[0]!.intersectionRatio, e[0]!.boundingClientRect), o)
	}
}








export class ScrollObserver {

	public userHandler?: (intersectionRatio: number, coordinates: DOMRect) => void
	public threshold?: number | number[]
	public rootMargin?: SideStyle
	public get safeRootMargin(): SideStyle { return this.rootMargin ? this.rootMargin : this.rootMargin = new SideStyle }






	public render(element: HTMLElement): this {
		if (!this.userHandler) return this

		let observer = HTMLElementDataStorage.get(element);


		if (observer) {
			if (this.threshold == observer.threshold && this.rootMargin?.toString() == observer.rootMargin?.toString()) {
				observer.userHandler = this.userHandler;
				return this
			}
			observer.observer.unobserve(element);
			observer.observer.disconnect();
		}

		observer = new ScrollObserverStorage(this.userHandler, this);
		HTMLElementDataStorage.set(element, observer);
		observer.observer.observe(element);
		return this
	}





	public destroy(element: HTMLElement): void {
		let observer = HTMLElementDataStorage.get(element);

		if (!observer) return

		observer.observer.unobserve(element);
		observer.observer.disconnect();
		HTMLElementDataStorage.delete(element)
	}
}