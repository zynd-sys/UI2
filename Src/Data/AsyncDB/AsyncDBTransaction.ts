import { AsyncDBObjectStoreReadOnly, AsyncDBObjectStoreReadWrite } from './AsyncDBObjectStore'

export enum TransactionMode {
	readonly = 'readonly',
	readwrite = 'readwrite'
}


type ReturnObjectStore<T extends TransactionMode, D> = T extends TransactionMode.readonly
	? AsyncDBObjectStoreReadOnly<D>
	: AsyncDBObjectStoreReadWrite<D>


export class AsyncDBTransaction<T extends TransactionMode, I extends { [key: string]: any }> {
	protected readonly transition: IDBTransaction
	public objectStores: { [key in keyof I]: ReturnObjectStore<T, I[key]> }

	public complete(commit: boolean = true): Promise<void> {
		if (commit) this.transition.commit();
		return new Promise((resolve, reject) => {
			this.transition.oncomplete = () => resolve()
			this.transition.onerror = () => reject(this.transition.error)
		})
	}


	constructor(db: IDBDatabase, mode: T, objectStores: (keyof I)[]) {
		this.transition = db.transaction(objectStores as string[], mode);
		let obj = {} as { [key in keyof I]: any };


		for (let objectStoreName of objectStores) obj[objectStoreName] = mode == TransactionMode.readonly
			? new AsyncDBObjectStoreReadOnly(this.transition.objectStore(objectStoreName as string))
			: new AsyncDBObjectStoreReadWrite(this.transition.objectStore(objectStoreName as string));


		this.objectStores = obj;
	}
}










export class AsyncDBVersionChange<newI extends { [key: string]: any }, oldI extends { [key: string]: any }> {
	protected readonly db: IDBDatabase

	public deleteObjectStore(name: keyof oldI): this { this.db.deleteObjectStore(name as string); return this }
	public createObjectStore(name: keyof newI, optionalParameters?: IDBObjectStoreParameters): (...index: { indexName: string, keyPath: string, objectParameters?: IDBIndexParameters }[]) => this {
		let objectStore = this.db.createObjectStore(name as string, optionalParameters);
		return (...index) => {
			index.forEach(v => objectStore.createIndex(v.indexName, v.keyPath, v.objectParameters));
			return this
		}
	}



	constructor(db: IDBDatabase) {
		this.db = db;
	}
}