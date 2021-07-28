import type { View } from "../../Elements/View";




export class LinkPathClass<V extends new (...p: any[]) => View> {

	protected readonly importView: () => Promise<V>
	protected view?: V
	public readonly path: string

	public previewValue?: new (...args: any[]) => View

	public getView(): Promise<V> | V { return this.view ? this.view : this.importView().then(v => this.view = v) }

	public preview<V extends new (...p: any[]) => View>(view: V, ...param: ConstructorParameters<V>): this { this.previewValue = view.bind(view, ...param); return this }

	constructor(path: string, view: () => Promise<V>) {
		this.path = path;
		this.importView = view;
	}
}


