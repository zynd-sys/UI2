import type { ElementAttribute, ElementAttributeInterface } from "../../ViewConstructors/Modifiers/Attributes"
import type { Listeners } from "../../ViewConstructors/Modifiers/Listeners/Listeners"
import type { ViewBuilder } from "../../ViewConstructors/ViewBuilder"
import { Styles } from "../../ViewConstructors/Modifiers/Styles"
import { SubElementsListeners, SubElementsStyles, ViewSubElements } from "../../ViewConstructors/ViewSubElements"




export class SpanView extends ViewSubElements<HTMLSpanElement> {
	protected HTMLElement?: HTMLSpanElement

	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>

	protected generateHTMLElement(): HTMLSpanElement { return document.createElement('span') }
	protected merge?(): void
}
export function Span(...elements: (ViewBuilder | undefined)[]): SpanView { return new SpanView(elements) }
