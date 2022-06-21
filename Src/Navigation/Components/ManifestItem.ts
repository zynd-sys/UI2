import { View } from '../../Elements/View'
import { LinkPathClass } from './LinkPath'



export type Manifest = [
	root: ManifestItem<'', URLSegment.root, any>,
	...items: ManifestItem<any, any,  any>[]
]




export enum URLSegment {
	part,
	root,
	generic
}





export class ManifestItem<P extends string, S extends URLSegment, V extends new (...p: any[]) => View> extends LinkPathClass<V> {

	public readonly segmentType: URLSegment
	public redirectsValue?: string[]

	public checkView(value: new (...p: any[]) => View): boolean { return typeof this.view == 'function' && this.view.prototype instanceof View && this.view == value }

	/** @param value default `true` */
	public preload(value: boolean = true): this { if (value && !(this.view instanceof Promise) && !this.isView(this.view)) this.view = this.view(); return this }

	public redirects(...value: string[]): this { this.redirectsValue = value; return this }

	constructor(pathType: S, path: P, view: V | (() => Promise<V>)) {
		super(path, view);
		this.segmentType = pathType;
	}
}