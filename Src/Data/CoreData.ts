import { AsyncDB } from "./IndexedDB/AsyncDB"
import { TransactionMode } from "./IndexedDB/AsyncDBTransaction"
import { OpenRequestAsyncDB } from "./IndexedDB/OpenRequestIDB"
import { Observed } from "./Observed"




// interface coreDataDBInterface {
// 	data: any
// 	id: string
// 	lastOpen: number
// }

class CoreDataDBClass {
	/** @default 604_800_000 ms or 1 week */
	public maxAgeObject = 604_800_000

	protected db: Promise<AsyncDB> | AsyncDB
	protected coreDataStorage: Map<CoreData, string> = new Map

	protected changesObjects: Set<CoreData> = new Set
	protected changesTimer: boolean = false
	protected syncOutHandler?: (ids: string[]) => void



	protected async unloadPage() {
		this.coreDataStorage.forEach(async (_, value) => {
			value.lastOpen = Date.now();
			await (await this.db).put('data',Object.assign({}, value))
		})
	}



	protected objectHandler(object: CoreData) {
		this.changesObjects.add(object);
		if (!this.changesTimer) {
			window.setTimeout(async () => {
				let ids: string[] = [];
				for (let coreData of this.changesObjects) {
					coreData.lastOpen = Date.now();
					(await this.db).put('data', Object.assign({}, coreData));
					ids.push(coreData.id)
				}
				if (this.syncOutHandler) this.syncOutHandler(ids)
				this.changesObjects.clear();
				this.changesTimer = false;
			})
			this.changesTimer = true;
		}
	}


	public isRegCoreDataClass(id: string, object: CoreData): boolean { return this.coreDataStorage.get(object) == id }

	public async regCoreDataClass(id: string, object: CoreData): Promise<CoreData | undefined> {
		if (this.isRegCoreDataClass(id, object)) throw new Error(`${id} use twice`)

		this.coreDataStorage.set(object, id);
		object.addBeacon(() => this.objectHandler(object));

		let coreData: CoreData | undefined = await (await this.db).get('data', id);
		if (coreData) delete coreData.lastOpen

		return coreData
	}




	public syncOut(handler: (ids: string[]) => void): void { this.syncOutHandler = handler }
	public async syncIn(ids: string[]): Promise<void> {
		let objects: CoreData[] = [];
		ids.forEach(v => { for (let [obj, id] of this.coreDataStorage) if (v == id) return objects.push(obj) });

		let dataStore = await (await this.db).transaction(TransactionMode.readonly, 'data').objectStores.data;
		objects.forEach(obj => {
			let id = this.coreDataStorage.get(obj);
			if (!id) return
			dataStore.get(id).then(data => Object.assign(obj, data))
		})
	}

	constructor() {
		this.db = new OpenRequestAsyncDB('UILibrary/CoreDataDB', 1)
			.upgrade(v => v.createObjectStore('data', { keyPath: 'id' })())
			.init()
			.then(async db => {
				let dataStore = await db.transaction(TransactionMode.readwrite, 'data').objectStores.data;

				let dateNow = Date.now();
				(await dataStore.getAll() as CoreData[]).forEach(coreData => {
					if (!coreData.lastOpen || dateNow - coreData.lastOpen > this.maxAgeObject) dataStore.delete(coreData.id)
				});
				return db
			})

		window.addEventListener('beforeunload', () => this.unloadPage(), { once: true })
	}
}
const CoreDataDB = new CoreDataDBClass









export abstract class CoreData extends Observed.Objects {
	public readonly id: string
	public lastOpen?: number

	protected abstract init(): Promise<void>
	protected abstract onUpdate?(): void



	constructor(id: string) {
		super();

		this.send(false);
		this.id = id;

		Promise.all([
			CoreDataDB.regCoreDataClass(id, this).then(data => { Object.assign(this, data); this.beaconAction() }),
			this.init().then(() => this.beaconAction())
		])
			.catch(error => console.error(error))
			.finally(() => { this.send(true) }) //console.log(this, JSON.stringify(this));
	}
}