import type { ViewBuilder } from "../ViewConstructors/ViewBuilder"
import type { LinkAttribute } from "./Link"
import type { View } from "./View"
import type { ElementAttribute } from "../ViewConstructors/Modifiers/Attributes"
import type { LinkPathClass } from "../Navigation/Components/LinkPath"
import { ViewSubElements, SubElementsStyles, SubElementsListeners } from "../ViewConstructors/ViewSubElements"
import { Listeners } from "../ViewConstructors/Modifiers/Listeners/Listeners"
import { Styles } from "../ViewConstructors/Modifiers/Styles"
import { App } from "../Navigation/App"











export class NavigationLinkView<V extends (new (...args: any) => View)> extends ViewSubElements<HTMLAnchorElement> {
	
	protected HTMLElement?: HTMLAnchorElement
	
	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners: Listeners<SubElementsListeners<HTMLAnchorElement>> = new Listeners
	protected attribute?: ElementAttribute<LinkAttribute>
	
	protected destination: string
	protected disablePopover?: boolean
	
	protected merge(newRender: NavigationLinkView<any>, element: HTMLAnchorElement): void { if (this.destination != newRender.destination) element.href = this.destination = newRender.destination; }
	protected generateHTMLElement(): HTMLAnchorElement {
		let element = document.createElement('a');
		element.href = this.destination;
		return element
	}
	


	public disableAnyPopover(): this { this.disablePopover = true; return this }




	protected importProperty(view: NavigationLinkView<any>): void {
		this.destination = view.destination;
		this.disablePopover = view.disablePopover
		super.importProperty(view);
	}




	constructor(view: V | LinkPathClass<V>, data: ConstructorParameters<V>, elements: (ViewBuilder | undefined)[]) {
		super(elements);
		this.destination = App.core.generateURL(view, data[0]);

		this.listeners.set('click', (_, event) => {
			try {
				if (this.disablePopover) App.core.disablePopover();
				App.core.navigate(view, data);
			}
			catch (error) { console.error(error) }
			finally { event.preventDefault() }
		});
	}
}

export function NavigationLink<V extends new (...p: any[]) => View>(view: V | LinkPathClass<V>, ...data: ConstructorParameters<V>): (...elements: (ViewBuilder | undefined)[]) => NavigationLinkView<V> { return (...elements) => new NavigationLinkView(view, data, elements) }
