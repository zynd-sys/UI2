

export type observerHandlerType = (action: Action, property: string | number) => void
export type observerBeaconType = () => void





export const StorageKey = Symbol('storage');

export interface ObserverInterface {
	[key: string]: any
	[key: number]: any
	[StorageKey]: ObservedStorage
	addHandler(value: observerHandlerType): () => void
	removeHandler(value: observerHandlerType): void
	addBeacon(value: observerBeaconType): () => void
	removeBeacon(value: observerBeaconType): void
}




export enum Action {
	change,
	add,
	delete
}










type storageBeaconType = Set<observerBeaconType | storageBeaconType>

export class ObservedStorage {
	protected readonly handler: Set<observerHandlerType> = new Set
	protected readonly beacon: storageBeaconType = new Set
	protected send: number = 0


	protected beaconAddLink(link: storageBeaconType): void { this.beacon.add(link) }
	protected beaconRemoveLink(link: storageBeaconType): void { this.beacon.delete(link) }








	public addHandler(value: observerHandlerType): () => void { this.handler.add(value); return () => this.removeHandler(value) }
	public removeHandler(value: observerHandlerType): void { this.handler.delete(value) }
	public addBeacon(value: observerBeaconType): () => void { this.beacon.add(value); return () => this.removeBeacon(value) }
	public removeBeacon(value: observerBeaconType): void { this.beacon.delete(value); }





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


export function isObserved(object: any): object is ObserverInterface { return typeof object == 'object' && object[StorageKey] ? true : false }
