import type { Color } from './Modifiers/Colors'
import { DefaultColor } from './Modifiers/Colors/DefaultColors'
import { ElementsContainerListeners, ViewElementsContainer } from './ViewElementsContainer'
import { SpanView } from '../Elements/Form/Span'
import { MainStyleSheet } from './Modifiers/CSS/MainStyleSheet'
import { CSSSelectore } from './Modifiers/CSS/CSSSelectore'
import { Direction } from './Enum/Direction'



















export interface FormElementListeners<E extends HTMLElement> extends ElementsContainerListeners<E> {
	'change'?: (element: E, event: Event) => void
	'input'?: (element: E, event: Event) => void
	'invalid'?: (element: E, event: Event) => void
}









MainStyleSheet.add(
	new CSSSelectore('.hiddenElement', {
		'position': 'absolute',
		'-webkit-appearance': 'none',
		'-moz-appearance': 'none',
		'appearance': 'none',
		'inline-size': '1px',
		'block-size': '1px',
		'overflow': 'hidden',
		'clip': 'rect(0 0 0 0)'
	}),
	new CSSSelectore('label.container', {
		'cursor': 'pointer',
		'flex-direction': Direction.horizontal,
		'max-inline-size': '100%',
		'inline-size': 'max-content'
	})
)


export abstract class ViewFormElement<E extends HTMLInputElement | HTMLProgressElement | HTMLSelectElement> extends ViewElementsContainer<{ parent: HTMLLabelElement, input: E }> {

	protected accentColorValue: Color = DefaultColor.blue
	protected isUpdating: boolean = false



	protected override importProperty(view: ViewFormElement<any>) {
		this.accentColorValue = view.accentColorValue;
		return super.importProperty(view)
	}
	protected generateHTMLElement(): { parent: HTMLLabelElement, input: E } {
		let labelElement = document.createElement('label');
		labelElement.classList.add('container');
		let inputElement = this.generateHiddenElement();
		inputElement.classList.add('hiddenElement')
		return {
			input: inputElement,
			parent: labelElement
		}
	}


	protected abstract generateHiddenElement(): E
	protected abstract generateAlternativeElement?(accentColorValue: Color): SpanView

	protected safeUpdate(action: () => void) {
		this.isUpdating = false;
		action();
		if (!this.HTMLElement && this.isUpdating) return

		if (!this.generateAlternativeElement) return
		let element = this.content.get(0);
		if (element && element instanceof SpanView) element.update(this.generateAlternativeElement(this.accentColorValue))
		return
	}



	public accentColor(value: Color): this { this.accentColorValue = value; return this }



	public override update(newRender: ViewFormElement<any>): void {
		if (!this.HTMLElement) { this.importProperty(newRender); return }

		this.isUpdating = true;

		let e = this.HTMLElement;

		if (this.merge) this.merge(newRender, this.HTMLElement);
		if (this.generateAlternativeElement) newRender.content.unshift(this.generateAlternativeElement(this.accentColorValue))
		this.content.render(e.parent, true, newRender.content, [e.input])
		this.renderModifiers(e.parent, newRender);
	}

	public override render(withAnimation: boolean = false): HTMLElement {
		if (this.HTMLElement) return this.HTMLElement.parent

		let e = this.HTMLElement = this.generateHTMLElement();

		if (this.generateAlternativeElement) this.content.unshift(this.generateAlternativeElement(this.accentColorValue))
		this.content.render(e.parent, withAnimation || this.animations.withChild, undefined, [e.input]);
		this.renderModifiers(e.parent, undefined, withAnimation);

		return e.parent
	}
}
