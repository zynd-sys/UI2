import { ObservedStorage, observerBeaconType, observerHandlerType, ObserverInterface, StorageKey } from "../ObservedContstructors/ObservedStorage"




export abstract class LightObserver implements ObserverInterface {
	[StorageKey]: ObservedStorage = new ObservedStorage


	public addHandler(value: observerHandlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: observerHandlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: observerBeaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: observerBeaconType): void { return this[StorageKey].removeBeacon(value) }

	protected action<P extends keyof this>(propertyName: P, value: this[P], isNewPropery: boolean = false) {
		this[propertyName] = value;
		this[StorageKey].userAction(propertyName as string | number, isNewPropery);
	}
}