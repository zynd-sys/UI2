import type { ViewBuilder } from "ViewConstructors/ViewBuilder"
import type { ElementAttribute } from "ViewConstructors/Modifiers/Attributes"
import type { Listeners } from "ViewConstructors/Modifiers/Listeners/Listeners"
import type { ElementsContainerStyles } from "CSS/Types/ElementsContainerStyles"
import { Direction } from "Enum/Direction"
import { Styles } from "CSS/Styles"
import { ViewElementsContainer, ElementsContainerListeners } from "ViewConstructors/ViewElementsContainer"


type TagName = 'section' | 'main' | 'footer' | 'header' | 'aside' | 'nav' | 'article' | 'div' | 'ul' | 'ol' | 'li'


export class StackView extends ViewElementsContainer<HTMLElement> {
	protected HTMLElement?: HTMLElement
	protected styles: Styles<ElementsContainerStyles> = new Styles
	protected listeners?: Listeners<ElementsContainerListeners<HTMLElement>>
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



	protected override importProperty(view: StackView): void {
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
