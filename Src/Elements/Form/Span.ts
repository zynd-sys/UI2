import type { ElementAttribute, ElementAttributeInterface } from "../../ViewConstructors/Modifiers/Attributes"
import type { Listeners } from "../../ViewConstructors/Modifiers/Listeners/Listeners"
import type { ViewBuilder } from "../../ViewConstructors/ViewBuilder"
import type { ElementsContainerStyles } from "../../ViewConstructors/Modifiers/CSS/Types/ElementsContainerStyles"
import { Styles } from "../../ViewConstructors/Modifiers/CSS/Styles"
import { ElementsContainerListeners, ViewElementsContainer } from "../../ViewConstructors/ViewElementsContainer"
import { MainStyleSheet } from "../../ViewConstructors/Modifiers/CSS/MainStyleSheet"
import { CSSSelectore } from "../../ViewConstructors/Modifiers/CSS/CSSSelectore"
import { Direction } from "../../ViewConstructors/Enum/Direction"




MainStyleSheet.add(new CSSSelectore('span.container', {
	'flex-direction': Direction.horizontal,
	'max-inline-size': '100%',
	'inline-size': 'max-content'
}))


export class SpanView extends ViewElementsContainer<HTMLSpanElement> {
	protected HTMLElement?: HTMLSpanElement

	protected styles: Styles<ElementsContainerStyles> = new Styles
	protected listeners?: Listeners<ElementsContainerListeners<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>

	protected generateHTMLElement(): HTMLSpanElement { return document.createElement('span') }
	protected merge?(): void
}
export function Span(...elements: (ViewBuilder | undefined)[]): SpanView { return new SpanView(elements) }
