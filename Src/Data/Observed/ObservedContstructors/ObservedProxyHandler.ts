import { ObserverInterface, StorageKey } from "./ObservedStorage";




export class ObservedProxyHandlerClass implements ProxyHandler<ObserverInterface> {
	public set(target: ObserverInterface, property: string | number | symbol, value: any, reciver: any) {
		if (typeof property == 'symbol') return Reflect.set(target, property, value, reciver);

		let isNewPropery: boolean = property in target;
		let oldValue = target[property];

		const setSuccessful = Reflect.set(target, property, value, reciver);
		if (!setSuccessful) return setSuccessful

		target[StorageKey].actionSet(oldValue, value, property, isNewPropery);

		return setSuccessful
	}
	public deleteProperty(target: ObserverInterface, property: string | number | symbol) {
		if (typeof property == 'symbol') return Reflect.deleteProperty(target, property);
		let oldValue = target[property];

		const deleteSuccessful = Reflect.deleteProperty(target, property);
		if (!deleteSuccessful) return deleteSuccessful

		target[StorageKey].actionDelete(oldValue, property);

		return deleteSuccessful
	}
}


export const ObjectsObservedProxyHandler = new ObservedProxyHandlerClass;




interface ObservedArrays extends Array<any>, ObserverInterface { }

export const ArraysObservedProxyHandlerClass = new class ArraysObservedProxyHandlerClass extends ObservedProxyHandlerClass {
	public override set(target: ObservedArrays, property: string | number | symbol, value: any, reciver: any): boolean {
		if(property === 'length') {
			if (value > target.length || value == target.length) return Reflect.set(target, property, value, reciver);

			const deleteElements = target.splice(value, target.length - value);
			for (let element of deleteElements) target[StorageKey].actionDelete(element, property);

			return Reflect.set(target, property, value, reciver);
		}

		return super.set(target, property, value, reciver)
	}
}

