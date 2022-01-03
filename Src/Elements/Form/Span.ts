import type { ElementAttribute, ElementAttributeInterface } from "../../ViewConstructors/Modifiers/Attributes"
import type { Listeners } from "../../ViewConstructors/Modifiers/Listeners/Listeners"
import type { ViewBuilder } from "../../ViewConstructors/ViewBuilder"
import type { SubElementsStyles } from "../../ViewConstructors/Modifiers/CSS/Types/SubElementsStyles"
import { Styles } from "../../ViewConstructors/Modifiers/CSS/Styles"
import { SubElementsListeners, ViewSubElements } from "../../ViewConstructors/ViewSubElements"




export class SpanView extends ViewSubElements<HTMLSpanElement> {
	protected HTMLElement?: HTMLSpanElement

	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>

	protected generateHTMLElement(): HTMLSpanElement { return document.createElement('span') }
	protected merge?(): void
}
export function Span(...elements: (ViewBuilder | undefined)[]): SpanView { return new SpanView(elements) }
