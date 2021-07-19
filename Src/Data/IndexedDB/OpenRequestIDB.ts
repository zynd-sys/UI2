import { AsyncDB } from "./AsyncDB";
import { UpgradeAsyncDB } from "./UpgradeAsyncDB";



export class OpenRequestAsyncDB {
	protected name: string
	protected version?: number
	protected upgradeEvent?: (db: UpgradeAsyncDB, oldVersion: number, newVersion?: number) => void
	protected blockedEvent?: () => void

	public upgrade(value: (db: UpgradeAsyncDB, oldVersion: number, newVersion?: number) => void): this { this.upgradeEvent = value; return this }
	public blocked(value: () => void): this { this.blockedEvent = value; return this }

	public init(): Promise<AsyncDB> {
		return new Promise((resolve, reject) => {
			let db = indexedDB.open(this.name, this.version);
			db.addEventListener('success', () => resolve(new AsyncDB(db.result)))
			db.addEventListener('error', () => reject(db.error))
			if (this.blockedEvent) db.addEventListener('blocked', this.blockedEvent);
			if (this.upgradeEvent) db.addEventListener('upgradeneeded', event => { if (this.upgradeEvent) this.upgradeEvent(new UpgradeAsyncDB(db.result), event.oldVersion, event.newVersion ? event.newVersion : undefined) });
		})
	}
	constructor(name: string, version?: number) {
		this.name = name;
		this.version = version;
	}
}