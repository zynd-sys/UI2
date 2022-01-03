import type { Listeners, ListenersInterface } from "../ViewConstructors/Modifiers/Listeners/Listeners"
import type { ElementAttribute, ElementAttributeInterface } from "../ViewConstructors/Modifiers/Attributes"
import type { MinimalStylesInterface } from "../ViewConstructors/Modifiers/CSS/Types/MinimalStylesType"
import { Styles } from "../ViewConstructors/Modifiers/CSS/Styles"
import { ViewModifiers } from "../ViewConstructors/ViewModifiers"






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