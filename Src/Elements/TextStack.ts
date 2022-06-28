import type { ElementAttribute, ElementAttributeInterface } from '../ViewConstructors/Modifiers/Attributes'
import type { Listeners, ListenersInterface } from '../ViewConstructors/Modifiers/Listeners/Listeners'
import type { ViewModifiers } from '../ViewConstructors/ViewModifiers'
import type { TextStyles } from '../Styles/CSS/Types'
import { ViewTextModifiers } from '../ViewConstructors/ViewTextModifiers'
import { ViewBuilder } from '../ViewConstructors/ViewBuilder'
import { ViewsList } from '../ViewConstructors/Modifiers/ListView'
import { MainStyleSheet, CSSSelectore } from '../Styles/CSS'
import { Styles } from '../ViewConstructors/Modifiers/Styles'








class TextItem extends ViewBuilder {
	protected HTMLElement?: Text

	protected content: string

	public update(newRender: TextItem): void {
		if (!this.HTMLElement) { this.content = newRender.content; return }

		if (newRender.content != this.HTMLElement.textContent) this.HTMLElement.textContent = this.content = newRender.content;
	}
	public render(): HTMLElement {
		if (this.HTMLElement) return this.HTMLElement as unknown as HTMLElement

		this.HTMLElement = document.createTextNode(this.content);
		return this.HTMLElement as unknown as HTMLElement
	}
	public destroy(): void {
		if (!this.HTMLElement) return
		this.HTMLElement.remove();
		this.HTMLElement = undefined;
	}
	public getRectElements(): void { return }


	constructor(value: string) { super(); this.content = value }
}





MainStyleSheet.add(
	new CSSSelectore('.text-conteainer.stack > *', {
		'vertical-align': 'text-bottom',
		'-webkit-user-select': 'inherit',
		'user-select': 'inherit',
		'color': 'inherit',
		'font': 'inherit',
	}),

	new CSSSelectore('.text-conteainer.stack > .text-conteainer', { 'display': 'inline-block' }),
	new CSSSelectore('.text-conteainer.stack > .container', { 'display': 'inline-flex' }),
	new CSSSelectore('.text-conteainer.stack > .container.grid', { 'display': 'inline-grid' })
)




export class TextStackView extends ViewTextModifiers<HTMLParagraphElement | HTMLHeadingElement> {
	protected HTMLElement?: HTMLParagraphElement | HTMLHeadingElement

	protected styles: Styles<TextStyles> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>


	protected content: ViewsList
	protected HTMLTagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' = 'p'

	/**
	* import: styles, listeners, content, HTMLTagName
	*/
	protected override importProperty(view: TextStackView): ReturnType<ViewModifiers<any>['importProperty']> {
		this.HTMLTagName = view.HTMLTagName;
		this.content = view.content;
		return super.importProperty(view);
	}




	protected merge(newRender: TextStackView, element: HTMLParagraphElement | HTMLHeadingElement): void {
		if (this.HTMLTagName != newRender.HTMLTagName) {
			this.HTMLElement = element = document.createElement(this.HTMLTagName);
			element.classList.add('stack')
		}
		this.content.render(element, true, newRender.content);
	}
	protected generateHTMLElement(): HTMLParagraphElement | HTMLHeadingElement {
		let element = document.createElement(this.HTMLTagName);
		element.classList.add('stack');
		this.content.render(element);
		return element
	}





	/** @param value default 'p' */
	public tagName(value: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'): this { this.HTMLTagName = value; return this }






	constructor(elements: (ViewBuilder | string)[]) {
		super();
		this.content = new ViewsList(elements.map(v => typeof v == 'string' ? new TextItem(v) : v))
			.renderNodeCollection();
	}
}

export function TextStack(...elements: (ViewBuilder | string)[]): TextStackView { return new TextStackView(elements) }