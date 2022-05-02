import type { ListenersInterface } from './Listeners';




type ListenersStorageData<I extends ListenersInterface<any>> = Map<string | number | symbol, { userHandler: I[keyof I], handleEvent: (event: Event) => void }>

class ListenersStorageClass {
	protected storage: WeakMap<HTMLElement, ListenersStorageData<any>> = new WeakMap()

	public getHandlers<I extends ListenersInterface<any>>(element: HTMLElement): ListenersStorageData<I> {
		let object = this.storage.get(element);
		if (object) return object

		object = new Map;
		this.storage.set(element, object);
		return object
	}
}

export const ListenersStorage = new ListenersStorageClass;