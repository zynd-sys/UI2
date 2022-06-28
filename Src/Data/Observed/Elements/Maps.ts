import { ObservedStorage, observerBeaconType, observerHandlerType, StorageKey } from '../ObservedContstructors/ObservedStorage';






export class Maps<K, V> extends Map<K, V> {
	public [StorageKey]: ObservedStorage = new ObservedStorage;

	public addHandler(value: observerHandlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: observerHandlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: observerBeaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: observerBeaconType): void { return this[StorageKey].removeBeacon(value) }


	public override clear(): void {
		this[StorageKey].silentActions(() => {
			this.forEach(v => this[StorageKey].actionDelete(v, ''));
			super.clear();
		})
		this[StorageKey].userAction('', false)
	}
	public override delete(key: K): boolean {
		let value = this.get(key);
		let result = super.delete(key);
		if (!result) return result

		this[StorageKey].actionDelete(value, String(key))

		return result
	}
	public override set(key: K, value: V): this {
		let oldValue = this.get(key);
		let isNewPropery = this.has(key);

		super.set(key, value);

		this[StorageKey].actionSet(oldValue, value, String(key), isNewPropery);

		return this
	}
}


