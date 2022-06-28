import { ObservedStorage, observerBeaconType, observerHandlerType, ObserverInterface, StorageKey } from '../ObservedContstructors/ObservedStorage';
import { ArraysObservedProxyHandlerClass } from '../ObservedContstructors/ObservedProxyHandler';





export class Arrays<T> extends Array<T> implements ObserverInterface {
	public [StorageKey]: ObservedStorage = new ObservedStorage;
	[key: string]: any;
	[key: number]: any;

	protected silentActions(actions: () => (Promise<void> | any)): Promise<void> | void { return this[StorageKey].silentActions(actions) }

	public addHandler(value: observerHandlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: observerHandlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: observerBeaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: observerBeaconType): void { return this[StorageKey].removeBeacon(value) }


	constructor(...elements: T[]) {
		super();
		let proxy = new Proxy<this>(this, ArraysObservedProxyHandlerClass);
		if (elements.length) this[StorageKey].silentActions(() => {
			for (let i = 0; i < elements.length; i++) this.push(elements[i]!)
		})
		return proxy
	}
}
