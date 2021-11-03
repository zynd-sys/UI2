
export namespace Observed {

	type handlerType = (action: Action, property: string | number) => void
	type beaconType = () => void
	const storage = Symbol('storage');

	export enum Action {
		change,
		add,
		delete
	}

	export interface Interface {
		[key: string]: any
		[key: number]: any
		[storage]: handlersStorage
		addHandler(value: handlerType): () => void
		removeHandler(value: handlerType): void
		addBeacon(value: beaconType): () => void
		removeBeacon(value: beaconType): void
	}





	const ProxyHandler = new class ProxyHandlerClass implements ProxyHandler<Objects | Arrays<any>> {
		public set(target: Objects | Arrays<any>, property: string | number | symbol, value: any, reciver: any) {
			if (property == 'length' || typeof property == 'symbol') return Reflect.set(target, property, value, reciver);

			let isNewPropery: boolean = property in target;
			let oldValue = target[property];

			const setSuccessful = Reflect.set(target, property, value, reciver);
			if (!setSuccessful) return setSuccessful

			const config = target[storage];
			if (value !== oldValue) {
				if (isObserved(oldValue)) oldValue[storage].beaconRemoveLink(config.beacon)
				if (isObserved(value)) value[storage].beaconAddLink(config.beacon)
			}

			if (config.send) {
				config.handlerAction(property, isNewPropery)
				config.beaconAction()
			}
			return setSuccessful
		}
		public deleteProperty(target: Objects | Arrays<any>, property: string | number | symbol) {
			if (typeof property == 'symbol') return Reflect.deleteProperty(target, property);
			let oldValue = target[property];

			const deleteSuccessful = Reflect.deleteProperty(target, property);
			if (!deleteSuccessful) return deleteSuccessful

			const config = target[storage];
			if (isObserved(oldValue)) oldValue[storage].beaconRemoveLink(config.beacon)

			if (config.send) {
				config.handlerAction(property, false)
				config.beaconAction()
			}
			return deleteSuccessful
		}
	}










	function addHandler(this: { [storage]: handlersStorage }, value: handlerType): () => void {
		this[storage].handler.push(value)
		return removeHandler.bind(this, value, false)
	}
	function removeHandler(this: { [storage]: handlersStorage }, value: handlerType): void {
		const index = this[storage].handler.indexOf(value);
		if (index > 0) this[storage].handler.splice(index, 1)
		//throw new Error('not found handler')
	}
	function addBeacon(this: { [storage]: handlersStorage }, value: beaconType): () => void {
		this[storage].beacon.push(value);
		return removeBeacon.bind(this, value, false)
	}
	function removeBeacon(this: { [storage]: handlersStorage }, value: beaconType): void {
		const index = this[storage].beacon.indexOf(value);
		if (index > 0) this[storage].beacon.splice(index, 1);
		// throw new Error('not found handler');
	}


	type storageBeaconType = (beaconType | storageBeaconType)[]
	class handlersStorage {
		public handler: handlerType[] = []
		public beacon: storageBeaconType = []
		public send: boolean = true


		public handlerAction(property: string | number, isNewPropery: boolean) {
			this.handler.forEach(value => {
				try { value(isNewPropery ? Action.add : Action.change, property) }
				catch (error) { console.error(error) }
			})
		}


		public beaconAddLink(link: storageBeaconType): void { this.beacon.push(link) }
		public beaconRemoveLink(link: storageBeaconType): void {
			this.beacon.some((value, index, array) => {
				if (value == link) {
					array.splice(index, 1);
					return true
				}
				return false
			})
		}
		public beaconAction(): void {
			let arr = [this.beacon]
			for (let v of arr) for (let v2 of v) {
				try { typeof v2 == 'function' ? v2() : arr.push(v2) }
				catch (error) { console.error(error) }
			}
		}
	}











	export abstract class LightObserver implements Observed.Interface {
		[storage]: handlersStorage = new handlersStorage;
		// [key: string]: any;
		// [key: number]: any;

		public addHandler(value: handlerType): () => void { return addHandler.call(this, value) }
		public removeHandler(value: handlerType): void { return removeHandler.call(this, value) }
		public addBeacon(value: beaconType): () => void { return addBeacon.call(this, value) }
		public removeBeacon(value: beaconType): void { return removeBeacon.call(this, value) }

		protected action<P extends keyof this>(propertyName: P, value: this[P], isNewPropery: boolean = false) {
			this[propertyName] = value;
			this[storage].beaconAction();
			this[storage].handlerAction(propertyName as string | number, isNewPropery)
		}
	}

	export class Binding<T extends (string | number | boolean | undefined)> implements Observed.Interface {
		[storage]: handlersStorage = new handlersStorage

		private _value: T
		public get value() { return this._value }
		public set value(value: T) {
			this._value = value;
			this[storage].beaconAction();
			this[storage].handlerAction('value', false);
		}


		public addHandler(value: handlerType): () => void { return addHandler.call(this, value) }
		public removeHandler(value: handlerType): void { return removeHandler.call(this, value) }
		public addBeacon(value: beaconType): () => void { return addBeacon.call(this, value) }
		public removeBeacon(value: beaconType): void { return removeBeacon.call(this, value) }


		constructor(value: T) { this._value = value }
	}

	export class Maps<K, V> extends Map<K, V> {
		[storage]: handlersStorage = new handlersStorage;

		public addHandler(value: handlerType): () => void { return addHandler.call(this, value) }
		public removeHandler(value: handlerType): void { return removeHandler.call(this, value) }
		public addBeacon(value: beaconType): () => void { return addBeacon.call(this, value) }
		public removeBeacon(value: beaconType): void { return removeBeacon.call(this, value) }

		protected action(propertyName: string, isNewPropery: boolean = false) {
			this[storage].beaconAction();
			this[storage].handlerAction(propertyName, isNewPropery)
		}

		public clear() {
			this.forEach(v => { if (isObserved(v)) v[storage].beaconRemoveLink(this[storage].beacon) });
			super.clear();
			this.action('')
		}
		public delete(key: K): boolean {
			let value = this.get(key);
			let result = super.delete(key);
			if (!result) return result

			if (isObserved(value)) value[storage].beaconRemoveLink(this[storage].beacon)
			this.action(String(key));

			return result
		}
		public set(key: K, value: V): this {
			let oldValue = this.get(key);
			if (oldValue == value) return this

			if (isObserved(oldValue)) oldValue[storage].beaconRemoveLink(this[storage].beacon)
			if (isObserved(value)) value[storage].beaconAddLink(this[storage].beacon)

			this.action(String(key));

			return this
		}
	}



	export abstract class Objects implements Interface {
		[storage]: handlersStorage = new handlersStorage;
		[key: string]: any;
		[key: number]: any;

		public addHandler(value: handlerType): () => void { return addHandler.call(this, value) }
		public removeHandler(value: handlerType): void { return removeHandler.call(this, value) }
		public addBeacon(value: beaconType): () => void { return addBeacon.call(this, value) }
		public removeBeacon(value: beaconType): void { return removeBeacon.call(this, value) }
		protected send(value: boolean): void { this[storage].send = value }
		protected beaconAction(): void { this[storage].beaconAction() }

		constructor() { return new Proxy(this, ProxyHandler as ProxyHandler<this>); }
	}




	export class Arrays<T> extends Array<T> implements Interface {
		[storage]: handlersStorage = new handlersStorage;
		[key: string]: any;
		[key: number]: any;

		public addHandler(value: handlerType): () => void { return addHandler.call(this, value) }
		public removeHandler(value: handlerType): void { return removeHandler.call(this, value) }
		public addBeacon(value: beaconType): () => void { return addBeacon.call(this, value) }
		public removeBeacon(value: beaconType): void { return removeBeacon.call(this, value) }
		protected send(value: boolean): void { this[storage].send = value }
		protected beaconAction(): void { this[storage].beaconAction() }

		constructor(...elements: T[]) {
			super();
			let proxy = new Proxy(this, ProxyHandler as ProxyHandler<this>);
			if (elements.length) {
				this[storage].send = false
				proxy.concat(elements);
				this[storage].send = true
			}
			return proxy
		}
	}

	export function isObserved(object: any): object is Interface { return typeof object == 'object' && object[storage] ? true : false }
}