import type { CompositingCoords } from "../ViewConstructors/Modifiers/Compositing";
import { ObserverInterface, isObserved } from "../Data/Observed";
import { AnimationStorage } from "../Data/Storages/Animations";
import { ViewsList } from "../ViewConstructors/Modifiers/ListView";
import { ViewBuilder } from "../ViewConstructors/ViewBuilder";
import { MainStyleSheet } from "../ViewConstructors/Modifiers/CSS/MainStyleSheet";
import { CSSSelectore } from "../ViewConstructors/Modifiers/CSS/CSSSelectore";






class ViewHTMLElement extends HTMLElement { };
customElements.define('ui-view', ViewHTMLElement);
MainStyleSheet.add(new CSSSelectore('ui-view', { 'display': 'contents' }))





const ViewStorageKey = Symbol('ViewStorage');


class ViewStorage {
	public HTMLElement?: ViewHTMLElement
	public renderingContent?: ViewsList

	public cancelHandlerStorage: Map<ObserverInterface, () => void> = new Map
	public isObserved: boolean = false
}



export function State(target: View, propertyKey: string): void { (target.constructor as typeof View).addObservedProperty(propertyKey) }














export abstract class View extends ViewBuilder {

	protected abstract override content: () => ViewBuilder


	static observedProperty?: Map<string | number | symbol, any>
	static addObservedProperty(value: string): void {
		if (!this.observedProperty) this.observedProperty = new Map;
		else if (!this.hasOwnProperty('observedProperty')) { this.observedProperty = new Map(this.observedProperty.entries()) }
		this.observedProperty.set(value, undefined);
	}
	public addSafeHandler(object: ObserverInterface, target: () => void): this {
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
			if (isObserved(value)) storage.cancelHandlerStorage.set(value, value.addBeacon(MainHandler))
			observedProperty.set(propertyName, value);

			Object.defineProperty(this, propertyName, {
				configurable: false,
				get(): any { return observedProperty.get(propertyName) },
				set(value: any): void {
					let oldValue = observedProperty.get(propertyName);
					observedProperty.set(propertyName, value);

					if (value !== oldValue) {
						if (isObserved(oldValue)) {
							let c = storage.cancelHandlerStorage.get(oldValue);
							if (c) { c(); storage.cancelHandlerStorage.delete(oldValue) }
						}
						if (isObserved(value)) storage.cancelHandlerStorage.set(value, value.addBeacon(MainHandler))
					}
					MainHandler()
				}
			})
		})
		storage.isObserved = true;
	}









	public render(newRender?: View, withAnimation?: boolean): ViewHTMLElement {
		const storage = this[ViewStorageKey];

		if (newRender) { newRender.destroy(withAnimation as any); newRender = undefined; }
		if (!storage.HTMLElement) storage.HTMLElement = new ViewHTMLElement;

		// timeout
		if (AnimationStorage.isAnimated) {
			AnimationStorage.addAnimationCompletionHandler(this, () => this.render(newRender, withAnimation));
			return storage.HTMLElement
		}

		if (storage.isObserved == false && (this.constructor as typeof View).observedProperty) this.setObservedProperty((this.constructor as typeof View).observedProperty!);

		if (storage.renderingContent) storage.renderingContent.render(storage.HTMLElement, withAnimation, new ViewsList([this.content()]))
		else { storage.renderingContent = new ViewsList([this.content()]); storage.renderingContent.render(storage.HTMLElement, withAnimation) }

		return storage.HTMLElement
	}







	public destroy(withAnimation?: boolean) {
		const storage = this[ViewStorageKey];
		storage.cancelHandlerStorage.forEach(v => v());
		storage.cancelHandlerStorage.clear();


		if (withAnimation) {
			let renderingContent = storage.renderingContent;
			let HTMLElement = storage.HTMLElement;

			let content = renderingContent?.destroy(withAnimation);
			let result: void | Promise<void>;
			if (Array.isArray(content)) result = Promise.all(content).then(() => HTMLElement?.remove());
			else HTMLElement?.remove()

			storage.HTMLElement = undefined;
			storage.renderingContent = undefined;
			return result
		}

		storage.renderingContent?.destroy();
		storage.HTMLElement?.remove();

		storage.renderingContent = undefined;
		storage.HTMLElement = undefined;
	}




	public getRectElements(storage: Map<HTMLElement, CompositingCoords>): void { this[ViewStorageKey].renderingContent?.forEach(view => view?.getRectElements(storage)); }
}
