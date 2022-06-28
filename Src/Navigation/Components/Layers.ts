import type { View } from '../../Elements/View';
import type { CompositingCoords } from '../../ViewConstructors/Modifiers/Compositing';
import type { ObserverInterface } from '../../Data/Observed';
import { ContentAlign } from '../../Styles/CSS/Enums/ContentAlign';
import { MainStyleSheet, CSSSelectore } from '../../Styles/CSS';




export enum AppLayerName {
	app,
	popover,
	// allert
}


class LayerHTMLElement extends HTMLElement { }
customElements.define('ui-layer', LayerHTMLElement);



MainStyleSheet.add(
	new CSSSelectore('ui-layer', { 'display': 'contents' }),
	new CSSSelectore(`ui-layer[layer='popover'] > ui-view > *`, {
		'will-change': 'transform, filter, height, width, margin, padding',
		'z-index': 101,
		'position': 'fixed',
		'inset': 0
	}),
	new CSSSelectore(`ui-layer[layer='app'] > ui-view > *`, {
		'min-block-size': '100vh',
		'justify-content': ContentAlign.start,
	})
)






export abstract class AppLayersClass {

	private cancelHandlerStorage: Map<ObserverInterface, () => void> = new Map
	private layersStorage: Map<AppLayerName, { element: LayerHTMLElement, view: View | undefined }> = new Map

	protected update(): void { this.layersStorage.forEach(v => v.view?.update()) }


	protected setLayer(layerName: AppLayerName, view: View, withAnimation?: boolean): void {
		let layer = this.layersStorage.get(layerName);
		if (!layer) { console.error('not found', layerName); return }
		// layer.element.textContent = null;

		if (layer.view?.constructor == view.constructor) view.update();
		let result = view.render(withAnimation);

		let firstElement = layer.element.firstElementChild;
		if (firstElement) { if (firstElement != result) firstElement.replaceWith(result) }
		else layer.element.appendChild(result);

		layer.view = view;
	}

	protected init(): void {
		let appElement = document.body.appendChild(new LayerHTMLElement);
		appElement.setAttribute('layer', 'app');
		this.layersStorage.set(AppLayerName.app, { element: appElement, view: undefined });

		let popoverElement = document.body.appendChild(new LayerHTMLElement);
		popoverElement.setAttribute('layer', 'popover');
		this.layersStorage.set(AppLayerName.popover, { element: popoverElement, view: undefined });
	}




	protected clearLayer(layerName: AppLayerName | 'all', withAnimation?: boolean): this {
		if (layerName == 'all') {
			this.layersStorage.forEach(v => {
				v.element.textContent = null;
				v.view = void v.view?.destroy();
			})

			return this
		}

		let layer = this.layersStorage.get(layerName);
		if (!layer) { console.error('not found', layerName); return this }

		let result = layer.view?.destroy(withAnimation as any);
		if (result instanceof Promise) result.then(() => layer!.element.textContent = null)
		else { layer.element.textContent = null }

		layer.view = undefined;
		return this
	}

	public getRectElements(storage: Map<HTMLElement, CompositingCoords>): void { this.layersStorage.forEach(v => v.view?.getRectElements(storage)) }

	public addGlobalListner(storage: ObserverInterface): void { this.cancelHandlerStorage.set(storage, storage.addBeacon(() => this.update())); }
	public removeGlobalListner(storage: ObserverInterface): void {
		let callback = this.cancelHandlerStorage.get(storage);
		if (callback) {
			callback();
			this.cancelHandlerStorage.delete(storage)
		}
	}




	constructor() {
		if (document.readyState != 'complete') window.addEventListener('load', () => this.init(), { once: true })
		else this.init()
	}
}
