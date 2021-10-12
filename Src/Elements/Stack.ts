import type { ViewBuilder } from "../ViewConstructors/ViewBuilder"
import type { ElementAttribute } from "../ViewConstructors/Styles/Attributes"
import type { Listeners } from "../ViewConstructors/Styles/Listeners/Listeners"
import { Direction } from "../ViewConstructors/Enum/Direction"
import { Styles } from "../ViewConstructors/Styles/Styles"
import { ViewSubElements, SubElementsStyles, SubElementsListeners } from "../ViewConstructors/ViewSubElements"


// type TagName = Omit<HTMLElementTagNameMap, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'iframe' | 'a' | 'button' | 'hr' | 'picture' | 'img' | 'source' | 'input' | 'head' | 'body' | 'html' | 'meta' | 'link' | 'srcipt' | 'style'>
type TagName = 'section' | 'main' | 'footer' | 'header' | 'aside' | 'nav' | 'article' | 'div' | 'ul' | 'ol' | 'li'


export class StackView extends ViewSubElements<HTMLElement> {
	protected HTMLElement?: HTMLElement
	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<HTMLElement>>
	protected attribute?: ElementAttribute<any>
	
	protected HTMLTagName: TagName = 'div'
	
	
	protected merge(newRender: StackView, element: HTMLElement): void {
		if (this.HTMLTagName != newRender.HTMLTagName) {
			this.HTMLTagName = newRender.HTMLTagName;
			this.HTMLElement = document.createElement(this.HTMLTagName);
			element.replaceWith(this.HTMLElement);
		}
	}
	protected generateHTMLElement(): HTMLElement { return document.createElement(this.HTMLTagName); }
	


	protected importProperty(view: StackView): void {
		this.HTMLTagName = view.HTMLTagName;
		return super.importProperty(view)
	}


	
	public tagName(value: TagName): this { this.HTMLTagName = value; return this }

	constructor(elements: (ViewBuilder | undefined)[]) { super(elements); }
}


/** ↔︎ */
export function HStack(...elements: (ViewBuilder | undefined)[]): StackView { return new StackView(elements).direction(Direction.horizontal) }
/** ↕︎ */
export function VStack(...elements: (ViewBuilder | undefined)[]): StackView { return new StackView(elements) }
/** ➘ */
export function ZStack(...elements: (ViewBuilder | undefined)[]): StackView { return new StackView(elements).direction(Direction.depth) }
