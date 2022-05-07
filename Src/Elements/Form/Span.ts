import type { ElementAttribute, ElementAttributeInterface } from '../../ViewConstructors/Modifiers/Attributes'
import type { Listeners } from '../../ViewConstructors/Modifiers/Listeners/Listeners'
import type { ViewBuilder } from '../../ViewConstructors/ViewBuilder'
import type { ElementsContainerStyles } from '../../Styles/CSS/Types'
import { ElementsContainerListeners, ViewElementsContainer } from '../../ViewConstructors/ViewElementsContainer'
import { Styles } from '../../ViewConstructors/Modifiers/Styles'
import { MainStyleSheet, CSSSelectore, Direction } from '../../Styles/CSS'




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
