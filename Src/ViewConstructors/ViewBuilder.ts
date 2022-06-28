import type { CompositingCoords } from './Modifiers/Compositing';




export abstract class ViewBuilder {

	protected abstract content: any

	public abstract render(withAnimation?: boolean): HTMLElement
	public abstract update(newRender: ViewBuilder): void
	public abstract destroy(withAnimation?: boolean): void | Promise<void>
	public abstract getRectElements(storage: Map<HTMLElement, CompositingCoords>): void
}

