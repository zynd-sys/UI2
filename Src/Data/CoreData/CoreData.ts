import type { CoreDataInteface } from './CoreDataInteface';
import { CoreDataDB } from './CoreDataDB';
import * as Observed from '../Observed'







class CoreDataSubObject extends Observed.Objects { }

export abstract class CoreData extends Observed.Objects implements CoreDataInteface {
	public readonly id: string
	public lastOpen?: number

	protected abstract init(data: Promise<CoreDataInteface | undefined>): Promise<void>

	protected addedNewObject<T extends object>(value: T): T {
		if (value.constructor == Object) return Object.assign(new CoreDataSubObject, value);
		if (Array.isArray(value)) { return new Observed.Arrays(...value) as T }
		if (value instanceof Map) { return new Observed.Maps(value) as T }
		return value
	}





	public update(value: CoreDataInteface): void {
		let elements: { [key: string]: any }[] = [this, value];
		for (let i = 0; i < elements.length; i = i + 2) {
			let d1 = elements[i]!;
			let d2 = elements[i + 1]!;

			for (let property in d2)
				if (typeof d2[property] == 'object' && typeof d1[property] == 'object') elements.push(d1, d2);
				else if (d1[property] != d2[property]) d1[property] = d2[property] instanceof Object ? this.addedNewObject(d2[property]) : d2[property];

			for (let property in d1)
				if (!(property in d2)) delete d1[property]
		}
	}

	public setLastOpen(value: number): this { this.silentActions(() => this.lastOpen = value); return this }

	constructor(id: string) {
		super();
		this.id = id
		let data = CoreDataDB.regCoreDataClass(this);

		this.silentActions(() => this.init(data).catch(error => console.error(error)))
			?.finally(() => this.userAction())
	}
}