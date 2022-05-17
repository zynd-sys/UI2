


class UIResizeObserverClass {
	protected observer = new ResizeObserver(elements => this.onResize(elements));
	protected handlersStorage: WeakMap<Element, (sizes: DOMRectReadOnly) => void> = new WeakMap

	protected onResize(values: ResizeObserverEntry[]): void {
		for (let item of values) {
			let handler = this.handlersStorage.get(item.target);
			if (!handler) { this.observer.unobserve(item.target); continue }

			try { handler(item.contentRect) }
			catch (error) { console.error(error) }
		}
	}

	public observe(element: Element, handler: (sizes: DOMRectReadOnly) => void): void {
		if (!this.handlersStorage.has(element)) this.observer.observe(element, { box: 'border-box' });
		this.handlersStorage.set(element, handler);
	}

	public unobserve(element: Element): void {
		this.observer.unobserve(element);
		this.handlersStorage.delete(element);
	}
}

export const UIResizeObserver = new UIResizeObserverClass;