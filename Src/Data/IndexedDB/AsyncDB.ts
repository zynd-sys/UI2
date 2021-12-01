import { TransactionMode, AsyncDBTransaction, AsyncDBVersionChange } from "./AsyncDBTransaction";










export abstract class AsyncDB<I extends { [key: string]: any }> {
	protected db: Promise<IDBDatabase>

	protected abstract upgrade(db: AsyncDBVersionChange<I, any>, oldVersion: number, newVersion: number | null): void
	protected abstract versionChange(): void
	protected abstract blocked(): void




	public async transaction<T extends TransactionMode>(type: T, ...objectStores: (keyof I)[]): Promise<AsyncDBTransaction<T, I>> {
		return new AsyncDBTransaction(await this.db, type, objectStores as string[])
	}



	public get<S extends keyof I>(objectStore: S, query: IDBValidKey | IDBKeyRange): Promise<I[S] | undefined> {
		return this.transaction(TransactionMode.readonly, objectStore).then(db => db.objectStores[objectStore].get(query))
	}
	public getAll<S extends keyof I>(objectStore: S, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<I[S][]> {
		return this.transaction(TransactionMode.readonly, objectStore).then(db => db.objectStores[objectStore].getAll(query, count))
	}
	public add<S extends keyof I>(objectStore: S, value: I[S], key?: IDBValidKey): Promise<void> {
		return this.transaction(TransactionMode.readwrite, objectStore).then(db => db.objectStores[objectStore].add(value, key))
	}
	public put<S extends keyof I>(objectStore: S, value: I[S], key?: IDBValidKey): Promise<void> {
		return this.transaction(TransactionMode.readwrite, objectStore).then(db => db.objectStores[objectStore].put(value, key))
	}
	public delete<S extends keyof I>(objectStore: S, key: IDBValidKey | IDBKeyRange): Promise<void> {
		return this.transaction(TransactionMode.readwrite, objectStore).then(db => db.objectStores[objectStore].delete(key))
	}



	constructor(name: string, version: number) {
		this.db = new Promise<IDBDatabase>((resolve, reject) => {
			let openDBRequest = indexedDB.open(name, version);

			openDBRequest.addEventListener('success', () => {
				openDBRequest.result.addEventListener('versionchange', () => this.versionChange())
				resolve(openDBRequest.result)
			})
			openDBRequest.addEventListener('error', () => reject(openDBRequest.error))
			openDBRequest.addEventListener('blocked', this.blocked);
			openDBRequest.addEventListener('upgradeneeded', event => { this.upgrade(new AsyncDBVersionChange(openDBRequest.result), event.oldVersion, event.newVersion) });
		})
	}
}