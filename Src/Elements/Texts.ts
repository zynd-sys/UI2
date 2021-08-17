import type { ElementAttribute, ElementAttributeInterface } from "../ViewConstructors/Styles/Attributes"
import type { Listeners, ListenersInterface } from "../ViewConstructors/Styles/Listeners"
import { Styles } from "../ViewConstructors/Styles/Styles"
import { ViewModifiers } from "../ViewConstructors/ViewModifiers"
import { TextStyles, ViewTextModifiers } from "../ViewConstructors/ViewTextModifiers"














export class TextsView extends ViewTextModifiers {
	protected HTMLElement?: HTMLParagraphElement | HTMLHeadingElement // | HTMLSpanElement

	protected styles: Styles<TextStyles> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>


	protected content: string
	protected scaling?: boolean
	protected HTMLTagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' = 'p' // | 'span'

	/**
	* import: styles, listeners, content, HTMLTagName
	*/
	protected importProperty(view: TextsView): ReturnType<ViewModifiers['importProperty']> {
		this.HTMLTagName = view.HTMLTagName;
		this.scaling = view.scaling;
		super.importProperty(view);
	}





	protected scaleFontSize(element: HTMLElement) {
		if (!element.isConnected || element.scrollWidth <= element.offsetWidth) return

		const size = Math.floor(element.offsetWidth / (element.scrollWidth / parseInt(window.getComputedStyle(element).fontSize)))
		element.style.setProperty('font-size', size + 'px');
		this.styles.set('font-size', size + 'px');
	}

	protected renderModifiers(element: HTMLElement, newRender?: ViewTextModifiers, withAnimatiom?: boolean): void {
		super.renderModifiers(element, newRender, withAnimatiom);

		if (this.scaling)
			if (element.isConnected) this.scaleFontSize(element)
			else window.requestAnimationFrame(() => this.scaleFontSize(element))
	}





	/** @param value defualt "p" */
	public tagName(value: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'): this { this.HTMLTagName = value; return this }
	/** 
	 * @param value default true
	 * @inDevelop
	 */
	public textScaleToFill(value: boolean = true): this { if (value) { this.unwrapWord(); this.scaling = value; }; return this }










	public render(newRender?: TextsView, withAnimatiom?: boolean): HTMLParagraphElement | HTMLHeadingElement { // | HTMLSpanElement

		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			this.HTMLElement = document.createElement(this.HTMLTagName);
			this.HTMLElement.textContent = this.content;

			this.renderModifiers(this.HTMLElement, undefined, withAnimatiom);
			return this.HTMLElement
		}


		// not update
		if (!newRender) {
			this.renderModifiers(this.HTMLElement)
			return this.HTMLElement
		}


		// update
		if (this.HTMLTagName != newRender.HTMLTagName) {
			let element = document.createElement(this.HTMLTagName);
			if (this.content != newRender.content) this.content = newRender.content;
			element.textContent = this.content;
			this.HTMLElement.replaceWith(element);
			this.HTMLElement = element;
		}
		if (this.content != newRender.content) {
			this.HTMLElement.textContent = newRender.content;
			this.content = newRender.content;
		}
		this.renderModifiers(this.HTMLElement, newRender, withAnimatiom);
		return this.HTMLElement
	};



	constructor(content: string) {
		super();
		this.content = content;
	}
}

/**
 * use document.font
 */
export function Texts(content: string): TextsView { return new TextsView(content) }
