import type { EnvironmentsList, EnvironmentsValues } from '../Environment';
import { Compositing, CompositingCoords } from '../ViewConstructors/Modifiers/Compositing';
import { ObserverInterface, isObserved } from '../Data/Observed';
import { ViewsList } from '../ViewConstructors/Modifiers/ListView';
import { ViewBuilder } from '../ViewConstructors/ViewBuilder';
import { MainStyleSheet, CSSSelectore } from '../Styles/CSS';
import { EnvironmentSnapshots } from '../Environment/EnvironmentSnapshots';







class ViewHTMLElement extends HTMLElement { };
customElements.define('ui-view', ViewHTMLElement);
MainStyleSheet.add(new CSSSelectore('ui-view', { 'display': 'contents' }))





const ViewStorageKey = Symbol('ViewStorage');


class ViewStorage {
	public timeout?: boolean
	public HTMLElement?: ViewHTMLElement
	public renderingContent: ViewsList = new ViewsList([])

	public dataStorage: Map<string, any> = new Map
	public cancelHandlerStorage: Map<ObserverInterface, () => void> = new Map
	public environmentSnapshots: EnvironmentSnapshots = new EnvironmentSnapshots

	public renderViews(HTMLElement: ViewHTMLElement, content: ViewBuilder, withAnimation?: boolean): void {
		const cancleSnapshot = this.environmentSnapshots.createSnapshots();
		this.renderingContent.render(HTMLElement, withAnimation, new ViewsList([content]));
		cancleSnapshot();
	}
}



export function State(target: View, propertyKey: string): void {
	if (typeof propertyKey == 'symbol') return

	Object.defineProperty(target, propertyKey, {
		configurable: false,
		get(this: View): any { return this[ViewStorageKey].dataStorage.get(propertyKey) },
		set(this: View, value: any): void {
			let oldValue = this[ViewStorageKey].dataStorage.get(propertyKey);
			this[ViewStorageKey].dataStorage.set(propertyKey, value);

			if (value !== oldValue) {
				if (isObserved(oldValue)) {
					let c = this[ViewStorageKey].cancelHandlerStorage.get(oldValue);
					if (c) { c(); this[ViewStorageKey].cancelHandlerStorage.delete(oldValue) }
				}
				if (isObserved(value)) this[ViewStorageKey].cancelHandlerStorage.set(value, value.addBeacon(() => this.update()))
			}
			this.update()
		}
	})
}


export type EnvironmenType<P extends EnvironmentsList> = typeof EnvironmentsValues[P]

/**
 * use `EnvType`
 * @example
 * Environmen('title') test: EnvironmenType<'title'> = 'test page'
 *
 *
 * @example
 * Environmen('keywords') test!: EnvironmenType<'keywords'>
 */
export function Environmen(property: Parameters<(typeof EnvironmentsValues)['safeChangeValue']>[0]): (target: View, propertyKey: string) => void {
	return (target, propertyKey) => {
		if (typeof propertyKey == 'symbol') return

		Object.defineProperty(target, propertyKey, {
			configurable: false,
			get(this: View): any { return this[ViewStorageKey].environmentSnapshots.get(property) },
			set(this: View, value: any): void {
				this[ViewStorageKey].environmentSnapshots.set(property, value);
				this.update();
			}
		})

	}
}













export abstract class View extends ViewBuilder {

	protected abstract override content: () => ViewBuilder


	protected [ViewStorageKey] = new ViewStorage




	public update(): void {
		const storage = this[ViewStorageKey];

		if (!storage.HTMLElement) return
		// if (newRender) { newRender.destroy(withAnimation as any); newRender = undefined; }

		if (!storage.timeout) {
			Compositing.requestAnimationFrame(0, () => {
				if (storage.HTMLElement) storage.renderViews(storage.HTMLElement, this.content());
				storage.timeout = false;
			})
			storage.timeout = true;
		}
	}



	public render(withAnimation: boolean = false): ViewHTMLElement {
		const storage = this[ViewStorageKey];

		if (storage.HTMLElement) return storage.HTMLElement


		storage.HTMLElement = new ViewHTMLElement;
		storage.renderViews(storage.HTMLElement, this.content(), withAnimation);

		return storage.HTMLElement
	}





	public destroy(withAnimation?: boolean) {
		const storage = this[ViewStorageKey];
		storage.cancelHandlerStorage.forEach(v => v());
		storage.cancelHandlerStorage.clear();


		if (withAnimation) {
			let renderingContent = storage.renderingContent;
			let HTMLElement = storage.HTMLElement;

			const cancleSnapshot = storage.environmentSnapshots.createSnapshots();
			let content = renderingContent?.destroy(withAnimation);
			cancleSnapshot();

			let result: void | Promise<void>;
			if (Array.isArray(content)) result = Promise.all(content).then(() => HTMLElement?.remove());
			else HTMLElement?.remove()

			storage.HTMLElement = undefined;
			storage.renderingContent.clear();
			return result
		}

		storage.renderingContent?.destroy();
		storage.HTMLElement?.remove();

		storage.renderingContent.clear();
		storage.HTMLElement = undefined;
	}




	public getRectElements(storage: Map<HTMLElement, CompositingCoords>): void { this[ViewStorageKey].renderingContent?.forEach(view => view?.getRectElements(storage)); }
}
