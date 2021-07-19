

export class AsyncDBObjectStoreReadOnly {
	protected objectStore: IDBObjectStore


	public count(key?: IDBValidKey | IDBKeyRange): Promise<number> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.count(key);
			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
	}
	public get(query: IDBValidKey | IDBKeyRange): Promise<any | undefined> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.get(query);
			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
	}
	public getKey(query: IDBValidKey | IDBKeyRange): Promise<IDBValidKey | undefined> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.getKey(query);
			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
	}
	public getAll(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<any[]> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.getAll(query, count);
			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
	}
	public getAllKeys(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<IDBValidKey[]> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.getAllKeys(query, count);
			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
	}
	// IDBObjectStore.openCursor
	// IDBObjectStore.openKeyCursor

	constructor(objectStore: IDBObjectStore) { this.objectStore = objectStore }
}





export class AsyncDBObjectStoreReadWrite extends AsyncDBObjectStoreReadOnly {
	public add(value: any, key?: IDBValidKey): Promise<void> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.add(value, key);
			request.onsuccess = () => resolve()
			request.onerror = () => reject(request.error)
		})
	}
	public clear(): Promise<void> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.clear();
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.onerror);
		})
	}
	public delete(key: IDBValidKey | IDBKeyRange): Promise<void> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.delete(key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.onerror);
		})
	}
	public put(value: any, key?: IDBValidKey): Promise<void> {
		return new Promise((resolve, reject) => {
			let request = this.objectStore.put(value, key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.onerror);
		})
	}
}