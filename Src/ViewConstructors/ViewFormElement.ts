import type { Color } from "./Styles/Colors/Colors"
import type { ViewBuilder } from "./ViewBuilder"
import { StackView } from "../Elements/Stack"
import { DefaultColor } from "./Styles/Colors/DefaultColors"
import { SubElementsListeners, ViewSubElements } from "./ViewSubElements"













export class SpanView extends StackView {
	protected HTMLTagName = 'span' as 'div'
	protected handlerElementSize?: (value: DOMRect) => void

	protected renderModifiers(element: HTMLElement, newRender?: ViewSubElements<any>, withAnimatiom?: boolean): void {
		let handler = this.handlerElementSize
		if (handler) if (element.isConnected) handler(element.getBoundingClientRect())
		else window.requestAnimationFrame(() => handler!(element.getBoundingClientRect()));
		return super.renderModifiers(element, newRender, withAnimatiom)
	}

	public getElementSize(value: (coordinates: DOMRect) => void): this { this.handlerElementSize = value; return this };

}
export function Span(...elements: (ViewBuilder | undefined)[]): SpanView { return new SpanView(elements) }














export interface FormElementListeners<E extends HTMLElement> extends SubElementsListeners<E> {
	'change'?: (element: E, event: Event) => void
	'input'?: (element: E, event: Event) => void
	'invalid'?: (element: E, event: Event) => void
}












export abstract class ViewFormElement<E extends { parent: HTMLLabelElement, input: HTMLInputElement | HTMLProgressElement | HTMLSelectElement }> extends ViewSubElements<E> {

	protected abstract elementStyleFirst?: boolean
	protected accentColorValue: Color = DefaultColor.blue




	protected importProperty(view: ViewFormElement<any>) {
		this.accentColorValue = view.accentColorValue;
		this.elementStyleFirst = view.elementStyleFirst;
		return super.importProperty(view)
	}
	protected generateHTMLElement(): E {
		let labelElement = document.createElement('label');
		labelElement.classList.add('container');
		return {
			input: this.generateHiddenElement(),
			parent: labelElement
		} as E
	}

	protected abstract generateHiddenElement(): E['input']
	protected abstract generateAlternativeElement?(accentColorValue: Color): SpanView




	public accentColor(value: Color): this { this.accentColorValue = value; return this }





	public render(newRender?: ViewFormElement<any>, withAnimatiom?: boolean): HTMLElement {
		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			let e = this.HTMLElement = this.generateHTMLElement();

			if (this.generateAlternativeElement && !(this.content.get(0) instanceof SpanView))
				if (this.elementStyleFirst) this.content.unshift(this.generateAlternativeElement(this.accentColorValue))
				else this.content.push(this.generateAlternativeElement(this.accentColorValue))
			this.content.render(e.parent, withAnimatiom || this.animations.withChild, undefined, [e.input]);
			this.renderModifiers(e.parent, undefined, withAnimatiom);

			return e.parent
		}

		let e = this.HTMLElement
		// not change
		if (!newRender) { this.update(this.HTMLElement); return e.parent }

		// changes
		if (this.merge) this.merge(newRender, this.HTMLElement);
		if (this.generateAlternativeElement && !(newRender.content.get(0) instanceof SpanView))
			if (this.elementStyleFirst) newRender.content.unshift(this.generateAlternativeElement(this.accentColorValue))
			else newRender.content.push(this.generateAlternativeElement(this.accentColorValue))
		this.content.render(e.parent, true, newRender.content, [e.input])
		this.renderModifiers(e.parent, newRender, withAnimatiom);
		return e.parent;
	}
}
