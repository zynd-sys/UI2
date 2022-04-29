import type { ColorMode } from '../../Data/PageData/PageDataColorMode'
import { View } from '../../Elements/View'
import { LinkPathClass } from './LinkPath'



export type Manifest = [
	root: ManifestItem<'', any>,
	...items: ManifestItem<any, any>[]
]




export enum URLSegment {
	part,
	root,
	generic
}





export class ManifestItem<P extends string, V extends new (...p: any[]) => View> extends LinkPathClass<V> {

	public readonly segmentType: URLSegment
	public redirectsValue?: string[]
	public colorModeValue?: ColorMode

	public checkView(value: new (...p: any[]) => View): boolean { return typeof this.view == 'function' && this.view.prototype instanceof View && this.view == value }

	public redirects(...value: string[]): this { this.redirectsValue = value; return this }
	public colorMode(value: ColorMode): this { this.colorModeValue = value; return this }

	constructor(pathType: URLSegment, path: P, view: V | (() => Promise<V>)) {
		super(path, view)
		this.segmentType = pathType;
	}
}