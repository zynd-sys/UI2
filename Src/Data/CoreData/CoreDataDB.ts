import type { CoreDataInteface } from './CoreDataInteface'
import { AsyncDB, AsyncDBVersionChange, TransactionMode } from '../AsyncDB'
import { packageName } from '../../name'
















interface dbInterface {
	data: CoreDataInteface
}
class DB extends AsyncDB<dbInterface> {

	protected upgrade(db: AsyncDBVersionChange<dbInterface, any>): void { db.createObjectStore('data', { keyPath: 'id' }) }
	protected versionChange(): void { window.location.reload() }
	protected blocked(): void { console.error(`${packageName}/CoreDataDB has blocked`) }

	constructor() { super(`${packageName}/CoreDataDB`, 1) }
}









const LocalStorageKey: 'CoreDataID' = 'CoreDataID';
const oldValueKey: 'oldValue' = 'oldValue';

class CoreDataDBClass {
	/** @default 604_800_000 ms or 1 week */
	public maxAgeObject = 604_800_000

	protected readonly db = new DB

	protected readonly coreDataStorage: Set<CoreDataInteface> = new Set
	protected readonly changesObjects: Set<CoreDataInteface> = new Set
	protected localStorageLastUpdate: string | undefined = undefined






	protected syncHandler(object: CoreDataInteface): void {
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
	protected async mainHandler(): Promise<void> {
		let transaction = await this.db.transaction(TransactionMode.readwrite, 'data')
		let dataStore = transaction.objectStores['data'];

		let ids: string[] = [];
		for (let coreData of this.changesObjects) {
			dataStore.put(Object.assign({}, coreData.setLastOpen(Date.now())));
			ids.push(coreData.id)
		}
		await transaction.complete();

		if (ids[0]) window.localStorage.setItem(LocalStorageKey, window.localStorage.getItem(LocalStorageKey) == ids[0] ? oldValueKey : ids[0])
		for (let i = 1; i < ids.length; i++) {
			let id = ids[i]!;
			window.localStorage.setItem(LocalStorageKey, id);
		}
	}





	protected checkRegCoreData(object: CoreDataInteface): boolean {
		if (this.coreDataStorage.has(object)) return true
		for (let coreData of this.coreDataStorage) if (coreData.id == object.id) return true
		return false
	}











	protected async unloadPage(): Promise<void> {
		let transaction = (await this.db.transaction(TransactionMode.readwrite, 'data')).objectStores['data'];
		const time = Date.now();
		for (let coreData of this.coreDataStorage) transaction.put(Object.assign({}, coreData.setLastOpen(time)))
	}

	protected async updateCoreData(id: string): Promise<void> {
		let coreData: CoreDataInteface | undefined
		for (let o of this.coreDataStorage) if (o.id == id) { coreData = o; break }

		let newData = await this.db.get('data', id);
		if (!newData || !coreData) return

		this.localStorageLastUpdate = id;
		window.setTimeout(() => this.localStorageLastUpdate = undefined);
		coreData.update(newData);
	}

	protected async init(): Promise<void> {
		let dataStore = (await this.db.transaction(TransactionMode.readwrite, 'data')).objectStores.data;
		const dateNow = Date.now();
		let items = await dataStore.getAll();

		for (let coreData of items) if (!coreData.lastOpen || dateNow - coreData.lastOpen > this.maxAgeObject)
			dataStore.delete(coreData.id)
	}








	public regCoreDataClass(object: CoreDataInteface): Promise<CoreDataInteface | undefined> {
		if (this.checkRegCoreData(object)) throw new Error(`${object.id} use twice`)

		this.coreDataStorage.add(object);
		object.addBeacon(() => this.syncHandler(object));

		return this.db.get('data', object.id).then(data => { if (data) delete data.lastOpen; return data });
	}

	constructor() {
		this.init();
		window.addEventListener('beforeunload', () => this.unloadPage(), { once: true });
		window.addEventListener('storage', event => {
			if (event.storageArea !== window.localStorage || event.key != LocalStorageKey || event.newValue === null) return

			if (event.newValue == oldValueKey) {
				if (event.oldValue) this.updateCoreData(event.oldValue);
				return
			}
			this.updateCoreData(event.newValue)
		})
	}
}


let CoreDataDB: CoreDataDBClass | undefined;
export function getCoreDataDB(): CoreDataDBClass { return CoreDataDB ? CoreDataDB : CoreDataDB = new CoreDataDBClass }
