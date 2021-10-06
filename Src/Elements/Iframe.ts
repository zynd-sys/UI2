import { ElementAttribute, ElementAttributeInterface } from "../ViewConstructors/Styles/Attributes"
import { Listeners, ListenersInterface } from "../ViewConstructors/Styles/Listeners"
import { Styles, StylesInterface } from "../ViewConstructors/Styles/Styles"
import { ViewModifiers } from "../ViewConstructors/ViewModifiers"




export class IframeView extends ViewModifiers<HTMLIFrameElement> {
	
	protected HTMLElement?: HTMLIFrameElement
	protected styles: Styles<StylesInterface> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLIFrameElement>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>


	protected content: string;

	protected generateHTMLElement(): HTMLIFrameElement {
		let element = document.createElement('iframe');
		element.src = this.content;
		return element
	}
	protected merge(newRender:IframeView,HTMLElement:HTMLIFrameElement):void {
		if (this.content != newRender.content) { this.content = newRender.content; HTMLElement.src = this.content }
		}



	constructor(src: string) {
		super();
		this.content = src;
	}
}

export function Ifrmae(src: string): IframeView { return new IframeView(src) }