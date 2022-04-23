import type { Listeners, ListenersInterface } from "ViewConstructors/Modifiers/Listeners/Listeners"
import type { ElementAttribute, ElementAttributeInterface } from "ViewConstructors/Modifiers/Attributes"
import type { MinimalStylesInterface } from "CSS/Types/MinimalStylesType"
import { Styles } from "CSS/Styles"
import { ViewModifiers } from "ViewConstructors/ViewModifiers"
import { MainStyleSheet } from "CSS/MainStyleSheet"
import { CSSSelectore } from "CSS/CSSSelectore"
import { ContentAlign } from "Enum/ContentAlign"
import { DefaultColor } from "Colors/DefaultColors"






MainStyleSheet.add(
	new CSSSelectore('hr', {
		'display': 'block',
		'min-inline-size': '1px',
		'min-block-size': '1px',
		'justify-self': ContentAlign.stretch,
		'align-self': ContentAlign.stretch,
		'background-color': DefaultColor.textColor,
	}),
	new CSSSelectore('hr.spacer', {
		'flex-grow': 1,
		'min-inline-size': 0,
		'min-block-size': 0,
		'background-color': DefaultColor.transparent,
	})
)



export class DividerView extends ViewModifiers<HTMLHRElement> {

	protected HTMLElement?: HTMLHRElement

	protected styles: Styles<MinimalStylesInterface> = new Styles
	protected listeners?: Listeners<ListenersInterface<any>> | undefined
	protected attribute?: ElementAttribute<ElementAttributeInterface> | undefined

	/** is spacer */
	protected content: boolean

	protected generateHTMLElement(): HTMLHRElement {
		let element = document.createElement('hr');
		if (this.content) element.classList.add('spacer')
		return element
	}
	protected merge(newRender: DividerView, element: HTMLHRElement): void {
		if (newRender.content) if (!element.classList.contains('spacer')) element.classList.add('spacer')
		else if (element.classList.contains('spacer')) element.classList.remove('spacer')
	}



	constructor(isSpacer: boolean = false) {
		super();
		this.content = isSpacer;
	}
}


export function Spacer(): DividerView { return new DividerView(true) }
export function Divider(): DividerView { return new DividerView() }