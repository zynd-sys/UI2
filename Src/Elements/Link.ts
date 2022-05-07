import type { ViewBuilder } from '../ViewConstructors/ViewBuilder'
import type { ReferrerPolicyOptions } from '../ViewConstructors/Enum/ReferrerPolicyOptions'
import type { LinkTarget } from '../ViewConstructors/Enum/LinkTarget'
import type { Crossorigin } from '../ViewConstructors/Enum/Crossorigin'
import type { ElementsContainerStyles } from '../Styles/CSS/Types'
import { ElementAttribute, SecurityPolicyAttribute, SecurityPolicyViewModifiers } from '../ViewConstructors/Modifiers/Attributes'
import { Listeners } from '../ViewConstructors/Modifiers/Listeners/Listeners'
import { ViewElementsContainer, ElementsContainerListeners } from '../ViewConstructors/ViewElementsContainer'
import { PhoneNumber, Email, URIBuilder } from '../Data/URI'
import { Styles } from '../ViewConstructors/Modifiers/Styles'













export interface LinkAttribute extends SecurityPolicyAttribute {
	'hreflang'?: string
	'target'?: LinkTarget
	'href'?: string | URL
	'download'?: boolean | string
}


















export class LinkView extends ViewElementsContainer<HTMLAnchorElement> implements SecurityPolicyViewModifiers {
	protected HTMLElement?: HTMLAnchorElement

	protected styles: Styles<ElementsContainerStyles> = new Styles
	protected listeners: Listeners<ElementsContainerListeners<HTMLAnchorElement>> = new Listeners
	protected attribute: ElementAttribute<LinkAttribute> = new ElementAttribute



	protected merge?(): void
	protected generateHTMLElement(): HTMLAnchorElement {
		let element = document.createElement('a');
		return element
	}



	public crossorigin(value: Crossorigin): this { this.safeAttribute.set('crossorigin', value); return this }
	public referrerPolicy(value: ReferrerPolicyOptions): this { this.attribute.set('referrerpolicy', value); return this }
	public pathLang(value: string): this { this.attribute.set('hreflang', value); return this }
	public target(value: LinkTarget): this { this.attribute.set('target', value); return this }
	public download(value: boolean | string = true): this { if (value == true || typeof value == 'string') this.attribute.set('download', value); return this }
	public override onClick(): this { return this }



	constructor(path: string | URL | PhoneNumber | Email, elements: (ViewBuilder | undefined)[], action?: (event: Event) => void) {
		super(elements);
		this.attribute.set('href', path instanceof URIBuilder ? path.toURI() : path)
		if (action) this.listeners.set('click', (_, event) => action(event));
	}
}


export function Link(href: string | URL, action?: (event: Event) => void): (...elements: (ViewBuilder | undefined)[]) => LinkView { return (...elements) => new LinkView(href, elements, action) }