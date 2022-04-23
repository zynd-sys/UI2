import type { GestureListners } from './Gesture/GestureListners';
import type { ListenersInterface } from './Listeners';



interface HTMLElementData<I extends ListenersInterface<any>> {
	events?: Map<keyof I, { userHandler: I[keyof I], handleEvent: (event: Event) => void }>
	gestureListners?: GestureListners
}


class ListenersStorageClass {
	protected storage: WeakMap<HTMLElement, HTMLElementData<any>> = new WeakMap()

	public getData<I extends ListenersInterface<any>>(element: HTMLElement): HTMLElementData<I> {
		let object = this.storage.get(element);
		if (typeof object == 'object') return object

		this.storage.set(element, object = {});
		return object
	}
}

export const ListenersStorage = new ListenersStorageClass;