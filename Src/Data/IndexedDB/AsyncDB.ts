import { TransactionMode, AsyncDBTransaction } from "./AsyncDBTransaction";






export class AsyncDB {
	protected db: IDBDatabase

	public transaction<T extends TransactionMode, S extends string[]>(type: T, ...objectStores: S): AsyncDBTransaction<T, S> {
		return new AsyncDBTransaction(this.db, type, objectStores)
	}



	public get(objectStore: string, query: IDBValidKey | IDBKeyRange): Promise<any> {
		return this.transaction(TransactionMode.readonly, objectStore).objectStores[objectStore].get(query);
	}
	public getAll(objectStore: string, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<any[]> {
		return this.transaction(TransactionMode.readonly, objectStore).objectStores[objectStore].getAll(query, count)
	}
	public add(objectStore: string, value: any, key?: IDBValidKey): Promise<void> {
		return this.transaction(TransactionMode.readwrite, objectStore).objectStores[objectStore].add(value, key)
	}
	public put(objectStore: string, value: any, key?: IDBValidKey): Promise<void> {
		return this.transaction(TransactionMode.readwrite, objectStore).objectStores[objectStore].put(value, key)
	}
	public delete(objectStore: string, key: IDBValidKey | IDBKeyRange): Promise<void> {
		return this.transaction(TransactionMode.readwrite, objectStore).objectStores[objectStore].delete(key)
	}


	constructor(db: IDBDatabase) { this.db = db }
}