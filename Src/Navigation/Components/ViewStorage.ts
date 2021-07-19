import type { ColorMode } from "../../Data/PageData/PageDataColorMode";
import type { View } from "../../Elements/View";


export class ViewStorageClass {
	protected readonly storage: Map<new (...p: any[]) => View, { path: string, generic: boolean, colorMode?: ColorMode }> = new Map;
	public ErrorView: (new (error: Error) => View) | undefined;
	public notFoundView: (new () => View) | undefined;

	public add(view: new (...p: any[]) => View, value: { path: string; generic: boolean, colorMode?: ColorMode }): this {
		this.storage.set(view, value);
		return this
	}
	public getPath(view: new (...p: any[]) => View): { path: string, generic: boolean, colorMode?: ColorMode } | undefined { return this.storage.get(view) }
	public getView(path: string): { colorMode?: ColorMode, generic: boolean, view: (new (...p: any[]) => View) } | undefined { for (let v of this.storage) if (v[1].path == path) return { view: v[0], generic: v[1].generic, colorMode: v[1].colorMode } }
}
