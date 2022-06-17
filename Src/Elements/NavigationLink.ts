import type { ViewBuilder } from '../ViewConstructors/ViewBuilder'
import type { LinkAttribute } from './Link'
import type { View } from './View'
import type { ElementAttribute } from '../ViewConstructors/Modifiers/Attributes'
import type { LinkPathClass } from '../Navigation/Components/LinkPath'
import type { ElementsContainerStyles } from '../Styles/CSS/Types'
import { ViewElementsContainer, ElementsContainerListeners } from '../ViewConstructors/ViewElementsContainer'
import { Listeners } from '../ViewConstructors/Modifiers/Listeners/Listeners'
import { App } from '../Navigation/App'
import { Direction } from '../Styles/CSS/Enums/Direction'
import { Styles } from '../ViewConstructors/Modifiers/Styles'
import { MainStyleSheet, CSSSelectore } from '../Styles/CSS'






MainStyleSheet.add(
	new CSSSelectore('a.container', {
		'color': 'inherit',
		'text-decoration': 'none',
		'flex-direction': Direction.horizontal,
		'max-inline-size': '100%',
		'inline-size': 'max-content'
	})
)




export class NavigationLinkView<V extends (new (...args: any) => View)> extends ViewElementsContainer<HTMLAnchorElement> {

	protected HTMLElement?: HTMLAnchorElement

	protected styles: Styles<ElementsContainerStyles> = new Styles
	protected listeners: Listeners<ElementsContainerListeners<HTMLAnchorElement>> = new Listeners
	protected attribute?: ElementAttribute<LinkAttribute>
	protected isNavigatedDisabled?: boolean

	protected destination: string
	protected alternativeDestination?: string
	protected disablePopover?: boolean

	protected override importProperty(view: NavigationLinkView<any>): void {
		this.destination = view.destination;
		this.disablePopover = view.disablePopover
		super.importProperty(view);
	}

	protected merge(newRender: NavigationLinkView<any>, element: HTMLAnchorElement): void { if (this.destination != newRender.destination) element.href = this.destination = newRender.destination; }
	protected generateHTMLElement(): HTMLAnchorElement {
		let element = document.createElement('a');
		element.href = this.destination;
		return element
	}


	/** @param value default - `true` */
	public disableNavigate(value: boolean = true): this { this.isNavigatedDisabled = value; return this }
	public disableAnyPopover(): this {
		if (this.alternativeDestination) this.destination = this.alternativeDestination;
		this.disablePopover = true;
		return this
	}

	public override onClick(): this { return this }









	constructor(view: V | LinkPathClass<V>, data: ConstructorParameters<V>, elements: (ViewBuilder | undefined)[]) {
		super(elements);

		const destination = App.generateURL(view, data[0]);
		if (typeof destination == 'string') this.destination = destination;
		else {
			this.destination = destination[0];
			this.alternativeDestination = destination[1];
		}

		this.listeners.set('click', (_, event) => {
			try {
				if(this.isNavigatedDisabled) return

				if (this.disablePopover) App.disablePopover();
				App.navigate(view, data);
			}
			catch (error) { console.error(error) }
			finally { event.preventDefault() }
		});
	}
}

export function NavigationLink<V extends new (...p: any[]) => View>(view: V | LinkPathClass<V>, ...data: ConstructorParameters<V>): (...elements: (ViewBuilder | undefined)[]) => NavigationLinkView<V> { return (...elements) => new NavigationLinkView(view, data, elements) }
