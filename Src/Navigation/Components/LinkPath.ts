import { View } from "../../Elements/View";
import { LightObserver } from "../../Data/Observed";




export class LinkPathClass<V extends new (...p: any[]) => View> extends LightObserver {
	protected view: V | (() => Promise<V>) | Promise<V>
	public readonly segment: string
	public loaded: boolean

	protected isView(v: V | (() => Promise<V>)): v is V { return v.prototype instanceof View }

	public getView(): Promise<V> | V {
		if (this.view instanceof Promise) return this.view
		if (this.isView(this.view)) return this.view;

		return this.view().then(v => {
			this.view = v;
			this.action('loaded', true);
			return v
		})
	}


	constructor(path: string, view: (() => Promise<V>) | V) {
		super()
		this.segment = path;
		this.view = view;
		this.loaded = this.isView(view)
	}
}


