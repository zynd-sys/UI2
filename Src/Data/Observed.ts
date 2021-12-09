
const StorageKey = Symbol('storage');


type storageBeaconType = Set<beaconType | storageBeaconType>
type handlerType = (action: Action, property: string | number) => void
type beaconType = () => void

export interface ObserverInterface {
	[key: string]: any
	[key: number]: any
	[StorageKey]: handlersStorage
	addHandler(value: handlerType): () => void
	removeHandler(value: handlerType): void
	addBeacon(value: beaconType): () => void
	removeBeacon(value: beaconType): void
}




export enum Action {
	change,
	add,
	delete
}












class handlersStorage {
	protected readonly handler: Set<handlerType> = new Set
	protected readonly beacon: storageBeaconType = new Set
	protected send: number = 0


	protected beaconAddLink(link: storageBeaconType): void { this.beacon.add(link) }
	protected beaconRemoveLink(link: storageBeaconType): void { this.beacon.delete(link) }








	public addHandler(value: handlerType): () => void { this.handler.add(value); return () => this.removeHandler(value) }
	public removeHandler(value: handlerType): void { this.handler.delete(value) }
	public addBeacon(value: beaconType): () => void { this.beacon.add(value); return () => this.removeBeacon(value) }
	public removeBeacon(value: beaconType): void { this.beacon.delete(value); }





	public silentActions<T extends Promise<any> | void | undefined>(actions: () => Promise<any> | void): Promise<any> | void {
		let isPomise: boolean = false;
		this.send++;
		try {
			let result = actions();
			if (result instanceof Promise) {
				isPomise = true;
				return result
					.catch(error => console.error(error))
					.finally(() => this.send--) as T
			}
		}
		catch (error) { console.error(error) }
		finally { if (!isPomise) this.send--; }
		return
	}





	public actionSet(oldValue: any, newValue: any, property: string | number, isNewPropery: boolean): void {
		if (newValue === oldValue) return

		if (isObserved(oldValue)) oldValue[StorageKey].beaconRemoveLink(this.beacon)
		if (isObserved(newValue)) newValue[StorageKey].beaconAddLink(this.beacon)


		if (!this.send) this.userAction(property, isNewPropery);
	}
	public actionDelete(value: any, property: string | number): void {
		if (isObserved(value)) value[StorageKey].beaconRemoveLink(this.beacon)

		if (!this.send) this.userAction(property, false)
	}




	public userAction(property: string | number, isNewPropery: boolean): this {
		if (this.send) return this

		for (let value of this.handler)
			try { value(isNewPropery ? Action.add : Action.change, property) }
			catch (error) { console.error(error) };

		let arr = [this.beacon];
		for (let a of arr) for (let handler of a)
			try { typeof handler == 'function' ? handler() : arr.push(handler) }
			catch (error) { console.error(error) }

		return this
	}
}














const ProxyHandler = new class ProxyHandlerClass implements ProxyHandler<Objects | Arrays<any>> {
	public set(target: Objects | Arrays<any>, property: string | number | symbol, value: any, reciver: any) {
		if (property == 'length' || typeof property == 'symbol') return Reflect.set(target, property, value, reciver);

		let isNewPropery: boolean = property in target;
		let oldValue = target[property];

		const setSuccessful = Reflect.set(target, property, value, reciver);
		if (!setSuccessful) return setSuccessful

		target[StorageKey].actionSet(oldValue, value, property, isNewPropery);

		return setSuccessful
	}
	public deleteProperty(target: Objects | Arrays<any>, property: string | number | symbol) {
		if (typeof property == 'symbol') return Reflect.deleteProperty(target, property);
		let oldValue = target[property];

		const deleteSuccessful = Reflect.deleteProperty(target, property);
		if (!deleteSuccessful) return deleteSuccessful

		target[StorageKey].actionDelete(oldValue, property);

		return deleteSuccessful
	}
}


























export class Binding<T extends (string | number | boolean | undefined)> implements ObserverInterface {
	[StorageKey]: handlersStorage = new handlersStorage

	private _value: T
	public get value() { return this._value }
	public set value(value: T) {
		this._value = value;
		this[StorageKey].userAction('value', false);
	}


	public addHandler(value: handlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: handlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: beaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: beaconType): void { return this[StorageKey].removeBeacon(value) }

	public toString(): string { return String(this._value) }
	public toJSON(): any { return this._value }


	constructor(value: T) { this._value = value }
}

export abstract class LightObserver implements ObserverInterface {
	[StorageKey]: handlersStorage = new handlersStorage


	public addHandler(value: handlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: handlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: beaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: beaconType): void { return this[StorageKey].removeBeacon(value) }

	protected action<P extends keyof this>(propertyName: P, value: this[P], isNewPropery: boolean = false) {
		this[propertyName] = value;
		this[StorageKey].userAction(propertyName as string | number, isNewPropery);
	}
}



export class Maps<K, V> extends Map<K, V> {
	[StorageKey]: handlersStorage = new handlersStorage;

	public addHandler(value: handlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: handlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: beaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: beaconType): void { return this[StorageKey].removeBeacon(value) }


	public clear() {
		this[StorageKey].silentActions(() => {
			this.forEach(v => this[StorageKey].actionDelete(v, ''));
			super.clear();
		})
		this[StorageKey].userAction('', false)
	}
	public delete(key: K): boolean {
		let value = this.get(key);
		let result = super.delete(key);
		if (!result) return result

		this[StorageKey].actionDelete(value, String(key))

		return result
	}
	public set(key: K, value: V): this {
		let oldValue = this.get(key);
		let isNewPropery = this.has(key);

		super.set(key, value);

		this[StorageKey].actionSet(oldValue, value, String(key), isNewPropery);

		return this
	}
}



export abstract class Objects implements ObserverInterface {
	[StorageKey]: handlersStorage = new handlersStorage;
	[key: string]: any;
	[key: number]: any;

	public addHandler(value: handlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: handlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: beaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: beaconType): void { return this[StorageKey].removeBeacon(value) }
	protected silentActions(actions: () => (Promise<void> | any)): Promise<void> | void { return this[StorageKey].silentActions(actions) }
	protected userAction(): void { this[StorageKey].userAction('', false) }

	constructor() { return new Proxy<this>(this, ProxyHandler); }
}




export class Arrays<T> extends Array<T> implements ObserverInterface {
	[StorageKey]: handlersStorage = new handlersStorage;
	[key: string]: any;
	[key: number]: any;

	public addHandler(value: handlerType): () => void { return this[StorageKey].addHandler(value) }
	public removeHandler(value: handlerType): void { return this[StorageKey].removeHandler(value) }
	public addBeacon(value: beaconType): () => void { return this[StorageKey].addBeacon(value) }
	public removeBeacon(value: beaconType): void { return this[StorageKey].removeBeacon(value) }
	protected silentActions(actions: () => (Promise<void> | any)): Promise<void> | void { return this[StorageKey].silentActions(actions) }


	constructor(...elements: T[]) {
		super();
		let proxy = new Proxy<this>(this, ProxyHandler);
		if (elements.length) this[StorageKey].silentActions(() => {
			for (let i = 0; i < elements.length; i++)this.push(elements[i])
		})
		return proxy
	}
}



export function isObserved(object: any): object is ObserverInterface { return typeof object == 'object' && object[StorageKey] ? true : false }
