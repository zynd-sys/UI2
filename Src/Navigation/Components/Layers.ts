import type { View } from "../../Elements/View";
import type { CompositingCoords } from "../../ViewConstructors/Modifiers/Compositing";
import { PageDataColorMode } from "../../Data/PageData/PageDataColorMode";
import { PageDataWidth } from "../../Data/PageData/PageDataWidth";
import { MainStyleSheet } from "../../ViewConstructors/Modifiers/CSS/MainStyleSheet";
import { CSSSelectore } from "../../ViewConstructors/Modifiers/CSS/CSSSelectore";
import { ContentAlign } from "../../ViewConstructors/Enum/ContentAlign";




export enum AppLayerName {
	app,
	popover,
	// allert
}


class LayerHTMLElement extends HTMLElement { };
customElements.define('ui-layer', LayerHTMLElement);



MainStyleSheet.add(
	new CSSSelectore('ui-layer', { 'display': 'contents' }),
	new CSSSelectore('ui-layer[layer="popover"] > ui-view > *', {
		'will-change': 'transform, filter, height, width, margin, padding',
		'z-index': 101,
		'position': 'fixed',
		'inset': 0
	}),
	new CSSSelectore('ui-layer[layer="app"] > ui-view > *', {
		'min-block-size': '100vh',
		'justify-content': ContentAlign.start,
	})
)






export class AppLayersClass {

	protected storage: Map<AppLayerName, { element: LayerHTMLElement, view: View | undefined }> = new Map


	public setLayer(layerName: AppLayerName, view: View, withAnimation?: boolean): void {
		let layer = this.storage.get(layerName);
		if (!layer) { console.error('not found', layerName); return }
		// layer.element.textContent = null;

		if (layer.view?.constructor == view.constructor) view.update();
		let result = view.render(withAnimation);

		let firstElement = layer.element.firstElementChild;
		if (firstElement) { if (firstElement != result) firstElement.replaceWith(result) }
		else layer.element.appendChild(result);

		layer.view = view;
	}




	public clearLayer(layerName: AppLayerName | 'all', withAnimation?: boolean): this {
		if (layerName == 'all') {
			this.storage.forEach(v => {
				v.element.textContent = null;
				v.view = void v.view?.destroy();
			})

			return this
		}

		let layer = this.storage.get(layerName);
		if (!layer) { console.error('not found', layerName); return this }

		let result = layer.view?.destroy(withAnimation as any);
		if (result instanceof Promise) result.then(() => layer!.element.textContent = null)
		else { layer.element.textContent = null };

		layer.view = undefined;
		return this
	}

	public getRectElements(storage: Map<HTMLElement, CompositingCoords>): void { this.storage.forEach(v => v.view?.getRectElements(storage)) }



	protected init(): void {
		let appElement = document.body.appendChild(new LayerHTMLElement);
		appElement.setAttribute('layer', 'app');
		this.storage.set(AppLayerName.app, { element: appElement, view: undefined });

		let popoverElement = document.body.appendChild(new LayerHTMLElement);
		popoverElement.setAttribute('layer', 'popover');
		this.storage.set(AppLayerName.popover, { element: popoverElement, view: undefined });


		PageDataColorMode.addBeacon(() => this.storage.forEach(v => v.view?.update()))
		PageDataWidth.addBeacon(() => this.storage.forEach(v => v.view?.update()))
	}

	constructor() {
		if (document.readyState != 'complete') window.addEventListener('load', () => this.init(), { once: true })
		else this.init()
	}
}