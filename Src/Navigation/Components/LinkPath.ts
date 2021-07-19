import type { View } from "../../Elements/View";



export enum PathType {
	part,
	root,
	generic
}



export class LinkPathClass<V extends new (...p: any[]) => View> {

	protected readonly importView: () => Promise<V>
	protected view?: V
	public readonly path: string
	public readonly pathType: PathType

	public previewValue?: new (...args: any[]) => View

	public getView(): Promise<V> | V { return this.view ? this.view : this.importView().then(v => this.view = v) }

	public preview<V extends new (...p: any[]) => View>(view: V, ...param: ConstructorParameters<V>): this { this.previewValue = view.bind(view, ...param); return this }

	constructor(pathType: PathType, path: string, view: () => Promise<V>) {
		this.path = path;
		this.pathType = pathType;
		this.importView = view;
	}
}


