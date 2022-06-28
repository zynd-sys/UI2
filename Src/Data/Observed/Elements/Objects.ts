import { ObservedStorage, observerBeaconType, observerHandlerType, ObserverInterface, StorageKey } from '../ObservedContstructors/ObservedStorage';
import { ObjectsObservedProxyHandler } from '../ObservedContstructors/ObservedProxyHandler';



export abstract class Objects implements ObserverInterface {

	[key: string]: any;
	[key: number]: any;

	public [StorageKey]: ObservedStorage = new ObservedStorage;

	protected silentActions(actions: () => (Promise<void> | any)): Promise<void> | void { return this[StorageKey].silentActions(actions) }
	protected userAction(): void { this[StorageKey].userAction('', false) }

	public addHandler(value: observerHandlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: observerHandlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: observerBeaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: observerBeaconType): void { return this[StorageKey].removeBeacon(value) }

	constructor() { return new Proxy<this>(this, ObjectsObservedProxyHandler); }
}
