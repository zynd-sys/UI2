import { AsyncDB } from "./AsyncDB";


export class UpgradeAsyncDB extends AsyncDB {
	public createObjectStore(name: string, optionalParameters?: IDBObjectStoreParameters): (...index: { indexName: string, keyPath: string, objectParameters?: IDBIndexParameters }[]) => this {
		let objectStore = this.db.createObjectStore(name, optionalParameters);
		return (...index) => {
			index.forEach(v => objectStore.createIndex(v.indexName, v.keyPath, v.objectParameters));
			return this
		}
	}
	// IDBObjectStore.deleteIndex()
	constructor(db: IDBDatabase) { super(db) }
}