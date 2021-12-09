import { ElementAttribute, ElementAttributeInterface } from "../ViewConstructors/Modifiers/Attributes"
import { Listeners, ListenersInterface } from "../ViewConstructors/Modifiers/Listeners/Listeners"
import { Styles, StylesInterface } from "../ViewConstructors/Modifiers/Styles"
import { ViewModifiers } from "../ViewConstructors/ViewModifiers"




export class IframeView extends ViewModifiers<HTMLIFrameElement> {

	protected HTMLElement?: HTMLIFrameElement
	protected styles: Styles<StylesInterface> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLIFrameElement>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>


	protected content: string | URL

	protected generateHTMLElement(): HTMLIFrameElement {
		let element = document.createElement('iframe');
		element.src = this.content.toString();
		return element
	}
	protected merge(newRender: IframeView, HTMLElement: HTMLIFrameElement): void {
		if (this.content != newRender.content) { this.content = newRender.content; HTMLElement.src = this.content.toString() }
	}



	constructor(src: string | URL) {
		super();
		this.content = src;
	}
}

export function Ifrmae(src: string | URL): IframeView { return new IframeView(src) }