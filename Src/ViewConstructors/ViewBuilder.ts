import type { CompositingCoords } from "./Modifiers/Compositing";




export abstract class ViewBuilder {
	public abstract render(newRender?: ViewBuilder, withAnimation?: boolean, ...param: any[]): HTMLElement
	public abstract destroy(withAnimation?: boolean, ...param: any[]): void | Promise<void>
	public abstract getRectElements(storage: Map<HTMLElement, CompositingCoords>): void


	protected abstract content: any
}

