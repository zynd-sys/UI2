import type { SideStyle } from "../../ViewConstructors/Styles/CollectableStyles/SideStyle";
import type { ListenersInterface } from "../../ViewConstructors/Styles/Listeners";


interface HTMLElementData<I extends ListenersInterface<any>> {
	events?: Map<keyof I, { userHandler: I[keyof I], handleEvent: (event: Event) => void }>
	scrollObserver?: { threshold?: number | number[], rootMargin?: SideStyle, userHandler: (intersectionRatio: number, coordinates: DOMRect) => void, observer: IntersectionObserver }
}


class HTMLElementDataStorageClass {
	protected storage: WeakMap<HTMLElement, HTMLElementData<any>> = new WeakMap()

	public getData<I extends ListenersInterface<any>>(element: HTMLElement): HTMLElementData<I> {
		let object = this.storage.get(element);
		if (typeof object == 'object') return object

		this.storage.set(element, object = {});
		return object
	}
}

export const HTMLElementDataStorage = new HTMLElementDataStorageClass;