import { AsyncDBObjectStoreReadOnly, AsyncDBObjectStoreReadWrite } from "./AsyncDBObjectStore"

export enum TransactionMode {
	readonly = 'readonly',
	readwrite = 'readwrite'
}




export class AsyncDBTransaction<T extends TransactionMode, S extends string[]> {
	protected transition: IDBTransaction
	public objectStores: { [key in S[any]]: { readonly: AsyncDBObjectStoreReadOnly, readwrite: AsyncDBObjectStoreReadWrite }[T] }

	public complete(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.transition.oncomplete = () => resolve()
			this.transition.onerror = () => reject(this.transition.error)
		})
	}

	constructor(db: IDBDatabase, type: T, objectStores: S) {
		this.transition = db.transaction(objectStores, type);
		this.objectStores = {} as { [key in S[any]]: { readonly: AsyncDBObjectStoreReadOnly, readwrite: AsyncDBObjectStoreReadWrite }[T] };
		objectStores.forEach(v => {
			this.objectStores[v as S[any]] = (type == TransactionMode.readonly ?
				new AsyncDBObjectStoreReadOnly(this.transition.objectStore(v)) :
				new AsyncDBObjectStoreReadWrite(this.transition.objectStore(v))
			) as { readonly: AsyncDBObjectStoreReadOnly, readwrite: AsyncDBObjectStoreReadWrite }[T]
		})
	}
}