import type { Objects } from '../Observed'


export interface CoreDataInteface extends Objects {
	readonly id: string
	lastOpen?: number

	update(value: CoreDataInteface): void
	setLastOpen(value: number): this
}