import { Observed } from "../Data/Observed";
import { AnimationStorage } from "../Data/Storages/Animations";
import { ViewBuilder } from "../ViewConstructors/ViewBuilder";






class ViewHTMLElement extends HTMLElement { };
customElements.define('ui-view', ViewHTMLElement);



const ViewStorageKey = Symbol('ViewStorage');


class ViewStorage {
	public HTMLElement?: ViewHTMLElement
	public renderingContent?: ViewBuilder

	public cancelHandlerStorage: Map<Observed.Interface, () => void> = new Map
	public isObserved: boolean = false
}



export function State(target: View, propertyKey: string): void { (target.constructor as typeof View).addObservedProperty(propertyKey) }














export abstract class View extends ViewBuilder {

	protected abstract content: () => ViewBuilder


	static observedProperty?: Map<string | number | symbol, any>
	static addObservedProperty(value: string): void {
		if (!this.observedProperty) this.observedProperty = new Map;
		else if (!this.hasOwnProperty('observedProperty')) { this.observedProperty = new Map(this.observedProperty.entries()) }
		this.observedProperty.set(value, undefined);
	}
	public addSafeHandler(object: Observed.Interface, target: () => void): this {
		this[ViewStorageKey].cancelHandlerStorage.set(object, object.addBeacon(target));
		return this
	}


	[ViewStorageKey] = new ViewStorage









	private setObservedProperty(observedProperty: Map<string | number | symbol, any>): void {
		const storage = this[ViewStorageKey];
		const MainHandler = () => this.render();

		observedProperty.forEach((_, propertyName) => {
			if (typeof propertyName == 'symbol') return

			let value: any = this[propertyName as keyof this];
			if (Observed.isObserved(value)) storage.cancelHandlerStorage.set(value, value.addBeacon(MainHandler))
			observedProperty.set(propertyName, value);

			Object.defineProperty(this, propertyName, {
				configurable: false,
				get(): any { return observedProperty.get(propertyName) },
				set(value: any): void {
					let oldValue = observedProperty.get(propertyName);
					observedProperty.set(propertyName, value);

					if (value !== oldValue) {
						if (Observed.isObserved(oldValue)) {
							let c = storage.cancelHandlerStorage.get(oldValue);
							if (c) { c(); storage.cancelHandlerStorage.delete(oldValue) }
						}
						if (Observed.isObserved(value)) storage.cancelHandlerStorage.set(value, value.addBeacon(MainHandler))
					}
					MainHandler()
				}
			})
		})
		storage.isObserved = true;
	}





	private setContent(target: ViewHTMLElement, element: HTMLElement): void {
		let firstElement = target.firstElementChild;
		if (firstElement) {
			if (AnimationStorage.checkOutAnimation(firstElement)) {
				let secondElement = target.children[1]
				if (secondElement) secondElement.replaceWith(element);
				else target.appendChild(element)
			} else if (firstElement != element) firstElement.replaceWith(element)
			return
		}
		target.appendChild(element);
	}




	public render(newRender?: View, withAnimatiom?: boolean): ViewHTMLElement {
		const storage = this[ViewStorageKey];

		if (newRender) { newRender.destroy(withAnimatiom as any); newRender = undefined; }
		if (!storage.HTMLElement) storage.HTMLElement = new ViewHTMLElement;

		// timeout
		if (AnimationStorage.isAnimated) {
			AnimationStorage.addAnimationCompletionHandler(this, () => this.render(newRender, withAnimatiom));
			return storage.HTMLElement
		}


		let observedProperty = (this.constructor as typeof View).observedProperty;
		if (observedProperty && !storage.isObserved) this.setObservedProperty(observedProperty);


		let contentNow: ViewBuilder | undefined = storage.renderingContent;
		let contentNew: ViewBuilder | undefined = this.content();



		if (!contentNow) {
			storage.renderingContent = contentNew;
			this.setContent(storage.HTMLElement, contentNew.render(undefined, withAnimatiom));
			return storage.HTMLElement
		}
		if (contentNow.constructor != contentNew.constructor) {
			storage.renderingContent = contentNew;
			contentNow.destroy(withAnimatiom);
			this.setContent(storage.HTMLElement, contentNew.render(undefined, withAnimatiom))
			return storage.HTMLElement
		}
		this.setContent(storage.HTMLElement, contentNow.render(contentNew))
		return storage.HTMLElement
	}







	// public destroy(withAnimatiom?: true, destroyContent?: boolean): Promise<void>
	// public destroy(withAnimatiom?: false, destroyContent?: boolean): void
	public destroy(withAnimatiom?: boolean, destroyContent: boolean = true) {
		const storage = this[ViewStorageKey];
		storage.cancelHandlerStorage.forEach(v => v());
		storage.cancelHandlerStorage.clear();


		if (withAnimatiom) {
			let renderingContent = storage.renderingContent;
			let HTMLElement = storage.HTMLElement;

			let result = renderingContent?.destroy(withAnimatiom);
			if (!(result instanceof Promise)) result = Promise.resolve()
			if (destroyContent) result.then(() => HTMLElement?.remove());

			storage.HTMLElement = undefined;
			storage.renderingContent = undefined;
			return result
		}

		if (destroyContent) {
			storage.renderingContent?.destroy();
			storage.HTMLElement?.remove();
		}
		storage.renderingContent = undefined;
		storage.HTMLElement = undefined;
	}
}
