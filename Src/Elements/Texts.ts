import type { ElementAttribute, ElementAttributeInterface } from '../ViewConstructors/Modifiers/Attributes'
import type { Listeners, ListenersInterface } from '../ViewConstructors/Modifiers/Listeners/Listeners'
import type { PhoneNumber, Email } from '../Data/URI'
import type { TextStyles } from '../Styles/CSS/Types'
import { ViewTextModifiers } from '../ViewConstructors/ViewTextModifiers'
import { Styles } from '../ViewConstructors/Modifiers/Styles'
import { EnvironmentsValues } from '../Environment'














export class TextsView extends ViewTextModifiers<HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement> {
	protected HTMLElement?: HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement

	protected styles: Styles<TextStyles> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>


	protected content: string
	protected scaling?: boolean
	protected HTMLTagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' = 'p'

	/**
	* import: styles, listeners, content, HTMLTagName
	*/
	protected override importProperty(view: TextsView): void {
		this.HTMLTagName = view.HTMLTagName;
		this.scaling = view.scaling;
		super.importProperty(view);
	}





	protected scaleFontSize(element: HTMLElement): void {
		if (!element.isConnected || element.scrollWidth <= element.offsetWidth) return

		const size = Math.floor(element.offsetWidth / (element.scrollWidth / parseInt(window.getComputedStyle(element).fontSize)))
		element.style.setProperty('font-size', size + 'px');
		this.styles.set('font-size', `${size}px`);
	}

	protected override renderModifiers(element: HTMLElement, newRender?: TextsView, withAnimation?: boolean): void {
		super.renderModifiers(element, newRender, withAnimation);

		if (this.scaling)
			if (element.isConnected) this.scaleFontSize(element)
			else window.requestAnimationFrame(() => this.scaleFontSize(element))
	}

	protected merge(newRender: TextsView, element: HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement): void {
		if (this.HTMLTagName != newRender.HTMLTagName) {
			this.HTMLElement = document.createElement(this.HTMLTagName);
			if (this.content != newRender.content) this.content = newRender.content;
			this.HTMLElement.textContent = this.content;
			this.HTMLElement.replaceWith(element);
		}
		if (this.content != newRender.content) {
			element.textContent = newRender.content;
			this.content = newRender.content;
		}
	}
	protected generateHTMLElement(): HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement {
		let element = document.createElement(this.HTMLTagName);
		element.textContent = this.content;
		return element
	}





	/** @param value default 'p' */
	public tagName(value: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'): this { this.HTMLTagName = value; return this }
	/** @param value default true */
	public textScaleToFill(value: boolean = true): this { if (value) { this.unwrapWord(); this.scaling = value; } return this }












	/**
	 * Converts non-string formats to a string using .toLocaleString
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
	 */
	constructor(content: string | number | bigint | Date | URL | PhoneNumber | Email, locales?: string | string[], options?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions) {
		super();
		if (typeof content == 'string') this.content = content
		else {
			if (!locales && EnvironmentsValues.lang) locales = EnvironmentsValues.lang;
			this.content = content.toLocaleString(locales, options);
		}
	}
}

/**
 * Converts non-string formats to a string using .toLocaleString
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 */
export function Texts(content: string | number | bigint | Date | URL, locales?: string | string[], options?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions): TextsView { return new TextsView(content, locales, options) }
