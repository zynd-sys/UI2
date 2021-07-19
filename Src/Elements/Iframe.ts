import { ElementAttribute, ElementAttributeInterface } from "../ViewConstructors/Styles/Attributes"
import { Listeners, ListenersInterface } from "../ViewConstructors/Styles/Listeners"
import { Styles, StylesInterface } from "../ViewConstructors/Styles/Styles"
import { ViewModifiers } from "../ViewConstructors/ViewModifiers"




export class IframeView extends ViewModifiers {
	protected HTMLElement?: HTMLIFrameElement
	protected styles: Styles<StylesInterface> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLIFrameElement>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>


	protected content: string;

	public render(newRender?: IframeView, withAnimatiom?: boolean): HTMLElement {

		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			this.HTMLElement = document.createElement('iframe');
			this.HTMLElement.src = this.content;
			this.renderModifiers(this.HTMLElement, undefined, withAnimatiom);
			return this.HTMLElement
		}

		// not update
		if (!newRender) {
			this.renderModifiers(this.HTMLElement);
			return this.HTMLElement
		}

		// update
		if (this.content != newRender.content) { this.content = newRender.content; this.HTMLElement.src = this.content }
		this.renderModifiers(this.HTMLElement, newRender, withAnimatiom);
		return this.HTMLElement;
	}

	constructor(src: string) {
		super();
		this.content = src;
	}
}

export function Ifrmae(src: string): IframeView { return new IframeView(src) }