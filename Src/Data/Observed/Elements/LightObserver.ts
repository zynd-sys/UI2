import { ObservedStorage, observerBeaconType, observerHandlerType, ObserverInterface, StorageKey } from '../ObservedContstructors/ObservedStorage'




export abstract class LightObserver implements ObserverInterface {
	public [StorageKey]: ObservedStorage = new ObservedStorage



	protected action<P extends keyof this>(propertyName: P, value: this[P], isNewPropery: boolean = false): void {
		this[propertyName] = value;
		this[StorageKey].userAction(propertyName as string | number, isNewPropery);
	}


	public addHandler(value: observerHandlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: observerHandlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: observerBeaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: observerBeaconType): void { return this[StorageKey].removeBeacon(value) }

}
