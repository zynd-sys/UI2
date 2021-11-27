import type { Color } from "./Styles/Colors/Colors"
import type { ViewBuilder } from "./ViewBuilder"
import type { ElementAttribute, ElementAttributeInterface } from "./Styles/Attributes"
import type { Listeners } from "./Styles/Listeners/Listeners"
import { DefaultColor } from "./Styles/Colors/DefaultColors"
import { SubElementsListeners, SubElementsStyles, ViewSubElements } from "./ViewSubElements"
import { Styles } from "./Styles/Styles"













export class SpanView extends ViewSubElements<HTMLSpanElement> {
	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<any>>
	protected HTMLElement?: HTMLSpanElement
	protected attribute?: ElementAttribute<ElementAttributeInterface>

	protected generateHTMLElement(): HTMLSpanElement { return document.createElement('span') }
	protected merge?(): void
}
export function Span(...elements: (ViewBuilder | undefined)[]): SpanView { return new SpanView(elements) }














export interface FormElementListeners<E extends HTMLElement> extends SubElementsListeners<E> {
	'change'?: (element: E, event: Event) => void
	'input'?: (element: E, event: Event) => void
	'invalid'?: (element: E, event: Event) => void
}












export abstract class ViewFormElement<E extends { parent: HTMLLabelElement, input: HTMLInputElement | HTMLProgressElement | HTMLSelectElement }> extends ViewSubElements<E> {

	protected accentColorValue: Color = DefaultColor.blue
	protected isUpdating: boolean = false



	protected importProperty(view: ViewFormElement<any>) {
		this.accentColorValue = view.accentColorValue;
		return super.importProperty(view)
	}
	protected generateHTMLElement(): E {
		let labelElement = document.createElement('label');
		labelElement.classList.add('container');
		let inputElement = this.generateHiddenElement();
		inputElement.classList.add('hiddenElement')
		return {
			input: inputElement,
			parent: labelElement
		} as E
	}
	protected update(parent: E) {
		if (!this.generateAlternativeElement) return super.update(parent)
		let element = this.content.get(0);
		if (element && element instanceof SpanView) element.render(this.generateAlternativeElement(this.accentColorValue))
		return super.update(parent)
	}

	protected abstract generateHiddenElement(): E['input']
	protected abstract generateAlternativeElement?(accentColorValue: Color): SpanView

	protected safeUpdate(action: () => void) {
		this.isUpdating = false;
		action();
		if (this.HTMLElement && !this.isUpdating) this.render();
	}



	public accentColor(value: Color): this { this.accentColorValue = value; return this }





	public render(newRender?: ViewFormElement<any>, withAnimation?: boolean): HTMLElement {
		this.isUpdating = true;

		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			let e = this.HTMLElement = this.generateHTMLElement();

			if (this.generateAlternativeElement) this.content.unshift(this.generateAlternativeElement(this.accentColorValue))
			this.content.render(e.parent, withAnimation || this.animations.withChild, undefined, [e.input]);
			this.renderModifiers(e.parent, undefined, withAnimation);

			return e.parent
		}

		let e = this.HTMLElement
		// not change
		if (!newRender) { this.update(this.HTMLElement); return e.parent }

		// changes
		if (this.merge) this.merge(newRender, this.HTMLElement);
		if (this.generateAlternativeElement) newRender.content.unshift(this.generateAlternativeElement(this.accentColorValue))
		this.content.render(e.parent, true, newRender.content, [e.input])
		this.renderModifiers(e.parent, newRender, withAnimation);
		return e.parent;
	}
}
