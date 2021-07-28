import type { ColorMode } from "../../Data/PageData/PageDataColorMode"
import { View } from "../../Elements/View"


export enum PathType {
	part,
	root,
	generic
}





export class ManifestItem<P extends string, V extends new (...p: any[]) => View> {
	protected viewValue: V | (() => Promise<V>)
	public pathType: PathType
	public path: P
	public redirectsValue?: string[]
	public colorModeValue?: ColorMode

	public get view(): V | Promise<V> { return this.viewValue.prototype instanceof View ? (this.viewValue as V) : (this.viewValue as (() => Promise<V>))().then(v => this.viewValue = v) }
	public checkView(value: new (...p: any[]) => View): boolean { return this.viewValue.prototype instanceof View && this.viewValue == value }

	public redirects(...value: string[]): this { this.redirectsValue = value; return this }
	public colorMode(value: ColorMode): this { this.colorModeValue = value; return this }

	constructor(pathType: PathType, path: P, view: V | (() => Promise<V>)) {
		this.viewValue = view;
		this.pathType = pathType;
		this.path = path;
	}
}