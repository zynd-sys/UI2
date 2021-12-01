import { AsyncDB } from "./IndexedDB/AsyncDB"
import { AsyncDBVersionChange, TransactionMode } from "./IndexedDB/AsyncDBTransaction"
import * as Observed from "./Observed"




interface dbInterface {
	data: CoreData
}

class DB extends AsyncDB<dbInterface> {

	protected upgrade(db: AsyncDBVersionChange<dbInterface, any>): void { db.createObjectStore('data', { keyPath: 'id' }) }
	protected versionChange(): void { window.location.reload() }
	protected blocked(): void { console.error('UILibrary/CoreDataDB has blocked') }

	constructor() { super('UILibrary/CoreDataDB', 1) }
}







const LocalStorageKey: 'CoreDataID' = 'CoreDataID';


class CoreDataDBClass {
	/** @default 604_800_000 ms or 1 week */
	public maxAgeObject = 604_800_000

	protected readonly db: DB = new DB
	protected readonly coreDataStorage: Set<CoreData> = new Set
	protected readonly changesObjects: Set<CoreData> = new Set
	protected localStorageLastUpdate: string | undefined = undefined






	protected syncHandler(object: CoreData) {
		if (this.localStorageLastUpdate == object.id) {
			this.localStorageLastUpdate = undefined;
			return
		}
		if (this.changesObjects.size == 0) window.setTimeout(() =>
			this.mainHandler()
				.catch(error => console.error(error))
				.finally(() => this.changesObjects.clear())
		)
		this.changesObjects.add(object);
	}
	protected async mainHandler() {
		let transaction = (await this.db.transaction(TransactionMode.readwrite, 'data'))
		let dataStore = transaction.objectStores['data'];

		let ids: string[] = [];
		for (let coreData of this.changesObjects) {
			dataStore.put(Object.assign({}, coreData.setLastOpen(Date.now())));
			ids.push(coreData.id)
		}
		await transaction.complete();

		if (ids[0]) window.localStorage.setItem(LocalStorageKey, window.localStorage.getItem(LocalStorageKey) == ids[0] ? 'oldValue' : ids[0])
		for (let i = 1; i < ids.length; i++) {
			let id = ids[i];
			window.localStorage.setItem(LocalStorageKey, id);
		}
	}





	protected checkRegCoreData(object: CoreData): boolean {
		if (this.coreDataStorage.has(object)) return true
		const id = object.id;
		for (let coreData of this.coreDataStorage) if (coreData.id == id) return true
		return false
	}

	public regCoreDataClass(object: CoreData): Promise<CoreData | undefined> {
		if (this.checkRegCoreData(object)) throw new Error(`${object.id} use twice`)

		this.coreDataStorage.add(object);
		object.addBeacon(() => this.syncHandler(object));

		return this.db.get('data', object.id).then(data => { if (data) delete data.lastOpen; return data });
	}









	protected async unloadPage() {
		let transaction = (await this.db.transaction(TransactionMode.readwrite, 'data')).objectStores['data'];
		const time = Date.now();
		for (let coreData of this.coreDataStorage) transaction.put(Object.assign({}, coreData.setLastOpen(time)))
	}

	protected async updateCoreData(id: string) {
		let coreData: CoreData | undefined
		for (let o of this.coreDataStorage) if (o.id == id) { coreData = o; break }

		let newData = await this.db.get('data', id);
		if (!newData || !coreData) return

		this.localStorageLastUpdate = id;
		window.setTimeout(() => this.localStorageLastUpdate = undefined);
		coreData.update(newData);
	}

	protected async init() {
		let dataStore = (await this.db.transaction(TransactionMode.readwrite, 'data')).objectStores.data;
		const dateNow = Date.now();
		let items = await dataStore.getAll();

		for (let coreData of items) if (!coreData.lastOpen || dateNow - coreData.lastOpen > this.maxAgeObject)
			dataStore.delete(coreData.id)
	}

	constructor() {
		this.init();
		window.addEventListener('beforeunload', () => this.unloadPage(), { once: true });
		window.addEventListener('storage', event => {
			if (event.storageArea !== window.localStorage || event.key != LocalStorageKey || event.newValue === null) return

			if (event.newValue == 'oldValue') {
				if (event.oldValue) this.updateCoreData(event.oldValue);
				return
			}
			this.updateCoreData(event.newValue)
		})
	}
}
const CoreDataDB = new CoreDataDBClass









export abstract class CoreData extends Observed.Objects {
	public readonly id: string
	public lastOpen?: number

	protected abstract init(data: Promise<CoreData | undefined>): Promise<void>

	protected addedNewObject<T extends object>(value: T): T {
		if (value.constructor == Object) return Object.assign(new class CoreDataSubObject extends Observed.Objects { }, value);
		if (Array.isArray(value)) { return new Observed.Arrays(...value) as T }
		return value
	}





	public update(value: CoreData): void {
		let elements: { [key: string]: any }[] = [this, value];
		for (let i = 0; i < elements.length; i = i + 2) {
			let d1 = elements[i];
			let d2 = elements[i + 1];

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