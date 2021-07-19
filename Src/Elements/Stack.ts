import type { ViewBuilder } from "../ViewConstructors/ViewBuilder"
import type { ElementAttribute } from "../ViewConstructors/Styles/Attributes"
import type { Listeners } from "../ViewConstructors/Styles/Listeners"
import { Direction } from "../ViewConstructors/Enum/Direction"
import { Styles } from "../ViewConstructors/Styles/Styles"
import { ViewSubElements, SubElementsStyles, SubElementsListeners } from "../ViewConstructors/ViewSubElements"


// type TagName = Omit<HTMLElementTagNameMap, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'iframe' | 'a' | 'button' | 'hr' | 'picture' | 'img' | 'source' | 'input' | 'head' | 'body' | 'html' | 'meta' | 'link' | 'srcipt' | 'style'>
type TagName = 'section' | 'main' | 'footer' | 'header' | 'aside' | 'nav' | 'article' | 'div' | 'ul' | 'ol' | 'li'


export class StackView extends ViewSubElements {
	protected HTMLElement?: HTMLElement
	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<HTMLElement>>
	protected attribute?: ElementAttribute<any>

	protected content: (ViewBuilder | undefined)[]
	protected HTMLTagName: TagName = 'div'


	public tagName(value: TagName): this { this.HTMLTagName = value; return this }



	protected importProperty(view: StackView): void {
		this.HTMLTagName = view.HTMLTagName;
		return super.importProperty(view)
	}

	public render(newRender?: StackView, withAnimatiom?: boolean): HTMLElement {

		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined }
			this.HTMLElement = document.createElement(this.HTMLTagName);

			this.renderMainElement(this.HTMLElement, this.generateContentElements(this.content));
			this.renderModifiers(this.HTMLElement, undefined, withAnimatiom);
			return this.HTMLElement
		}


		// not update
		if (!newRender) {
			this.renderModifiers(this.HTMLElement);
			return this.HTMLElement
		}


		// update
		if (this.HTMLTagName != newRender.HTMLTagName) {
			this.HTMLTagName = newRender.HTMLTagName;
			this.HTMLElement = document.createElement(this.HTMLTagName)
		}

		this.renderMainElement(this.HTMLElement, this.generateContentElements(this.content, newRender.content, true));
		this.renderModifiers(this.HTMLElement, newRender, withAnimatiom);
		return this.HTMLElement;
	}

	constructor(elements: (ViewBuilder | undefined)[]) {
		super();
		this.content = elements;
	}
}


/** ↔︎ */
export function HStack(...elements: (ViewBuilder | undefined)[]): StackView { return new StackView(elements).direction(Direction.horizontal) }
/** ↕︎ */
export function VStack(...elements: (ViewBuilder | undefined)[]): StackView { return new StackView(elements) }
/** ➘ */
export function ZStack(...elements: (ViewBuilder | undefined)[]): StackView { return new StackView(elements).direction(Direction.depth) }
