import { ObservedStorage, observerBeaconType, observerHandlerType, ObserverInterface, StorageKey } from '../ObservedContstructors/ObservedStorage';




export class Binding<T extends (string | number | boolean | undefined)> implements ObserverInterface {
	private _value: T

	protected beforeChangeHandler?: (value: T, notify: (value: boolean) => void) => T

	public [StorageKey]: ObservedStorage = new ObservedStorage

	public get value(): T { return this._value }
	public set value(value: T) {
		let notify: boolean = true;
		this._value = this.beforeChangeHandler ? this.beforeChangeHandler(value, n => notify = n) : value;
		if (notify) this[StorageKey].userAction('value', false);
	}


	public addHandler(value: observerHandlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: observerHandlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: observerBeaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: observerBeaconType): void { return this[StorageKey].removeBeacon(value) }
	public beforeChange(value: (value: T, notify: (value: boolean) => void) => T): this { this.beforeChangeHandler = value; return this }

	public toString(): string { return String(this._value) }
	public toJSON(): any { return this._value }


	constructor(value: T) { this._value = value }
}
