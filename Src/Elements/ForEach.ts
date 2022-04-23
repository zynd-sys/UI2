import { CSSSelectore } from "CSS/CSSSelectore"
import { MainStyleSheet } from "CSS/MainStyleSheet"
import { Compositing, CompositingCoords } from "ViewConstructors/Modifiers/Compositing"
import { ViewBuilder } from "ViewConstructors/ViewBuilder"
import { Units } from "Enum/Units"
import { UIAnimationClass } from "ViewConstructors/Modifiers/Animation/UIAnimation"














class ForEachHTMLElement extends HTMLElement { }
customElements.define('ui-foreach', ForEachHTMLElement)
MainStyleSheet.add(new CSSSelectore('ui-foreach', { 'display': 'contents' }))









export class ForEachView<T> extends ViewBuilder {

	protected HTMLElement?: ForEachHTMLElement
	protected moveAnimationValue: UIAnimationClass = new UIAnimationClass(600)
	protected content: Map<any, { index: number, view: ViewBuilder }> = new Map

	protected importProperty(view: ForEachView<any>): void {
		this.content = view.content;
	}




	public moveAnimation(animation: UIAnimationClass): this { this.moveAnimationValue = animation; return this }








	public update(newRender: ForEachView<any>): void {
		if (!this.HTMLElement) { this.importProperty(newRender); return }

		let elementsRect: Map<HTMLElement, DOMRect> | undefined;
		if (!Compositing.isRendering()) {
			elementsRect = new Map;
			for (let element of this.HTMLElement.children) elementsRect.set(element as HTMLElement, element.getBoundingClientRect());
		}

		let elements: { index: number, element: HTMLElement }[] = [];
		this.content.forEach((view, data) => {
			if (newRender.content.has(data)) return
			elements.push({ index: view.index, element: view.view.render() })
			view.view.destroy(true)
			this.content.delete(data)
		})
		newRender.content.forEach((viewNew, data) => {
			let viewNow = this.content.get(data);
			if (!viewNow) {
				this.content.set(data, viewNew);
				elements.push({ index: viewNew.index, element: viewNew.view.render(true) })
				return
			}

			if (viewNew.view.constructor != viewNow.view.constructor) {
				elements.push({ index: viewNow.index, element: viewNow.view.render() })
				viewNow.view.destroy(true);
			} else {
				viewNow.view.update(viewNew.view)
				viewNow.index = viewNew.index;
			}

			elements.push({ index: viewNow.index, element: viewNow.view.render(true) })
		})
		elements.sort((a, b) => a.index - b.index);

		let content = this.HTMLElement.children;
		for (let i = 0; i < elements.length; i++) {
			let newElement = elements[i]!.element;
			let oldElment = content[i];
			if (oldElment == newElement) continue
			if (!oldElment) { this.HTMLElement.appendChild(newElement); continue }

			oldElment.replaceWith(newElement)
		}


		if (elementsRect) elementsRect.forEach((oldCoord, element) => {
			if (!element.isConnected || element.getAnimations().length) return
			let newCoord = element.getBoundingClientRect();

			if (oldCoord.top != newCoord.top || oldCoord.left != newCoord.left) this.moveAnimationValue
				.translateXEffect(Units.px, oldCoord.left + oldCoord.width / 2 - newCoord.left - newCoord.width / 2, 0)
				.translateYEffect(Units.px, oldCoord.top + oldCoord.height / 2 - newCoord.top - newCoord.height / 2, 0)
				.animate(element)
		})
	}

	public render(withAnimation: boolean = false): HTMLElement {
		if (this.HTMLElement) return this.HTMLElement

		let element = this.HTMLElement = new ForEachHTMLElement;
		this.content.forEach((item) => element.appendChild(item.view.render(withAnimation)));

		return element
	}

	public destroy(withAnimation: boolean = false): void | Promise<void> {
		if (withAnimation && this.HTMLElement) {
			let animations: (Promise<void> | void)[] = [];
			let HTMLElement = this.HTMLElement;
			this.content.forEach(item => animations.push(item.view.destroy(withAnimation)));
			return Promise.all(animations).then(() => {
				HTMLElement.remove();
				this.HTMLElement = undefined;
			})
		}
		this.content.forEach(v => v.view.destroy())
		this.HTMLElement?.remove();
		this.HTMLElement = undefined
	}

	public getRectElements(storage: Map<HTMLElement, CompositingCoords>): void {
		this.content.forEach(v => v.view.getRectElements(storage))
	}




	constructor(data: Iterable<T>, generator: (data: T, index: number) => ViewBuilder) {
		super();
		let i = 0;
		for (let item of data) {
			this.content.set(item, { index: i, view: generator(item, i) })
			i++
		}
	}
}

export function ForEach<T>(data: Iterable<T>): (callback: (data: T, index: number) => ViewBuilder) => ForEachView<T> {
	return callback => new ForEachView(data, callback)
}