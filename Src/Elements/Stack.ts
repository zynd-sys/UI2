import type { ViewBuilder } from "../ViewConstructors/ViewBuilder"
import type { ElementAttribute } from "../ViewConstructors/Modifiers/Attributes"
import type { Listeners } from "../ViewConstructors/Modifiers/Listeners/Listeners"
import type { SubElementsStyles } from "../ViewConstructors/Modifiers/CSS/Types/SubElementsStyles"
import { Direction } from "../ViewConstructors/Enum/Direction"
import { Styles } from "../ViewConstructors/Modifiers/CSS/Styles"
import { ViewSubElements, SubElementsListeners } from "../ViewConstructors/ViewSubElements"


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
