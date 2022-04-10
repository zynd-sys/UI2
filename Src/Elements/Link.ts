import type { ViewBuilder } from "../ViewConstructors/ViewBuilder"
import type { ElementsContainerStyles } from "../ViewConstructors/Modifiers/CSS/Types/ElementsContainerStyles"
import type { LinkTarget } from "../ViewConstructors/Enum/LinkTarget"
import { Listeners } from "../ViewConstructors/Modifiers/Listeners/Listeners"
import { Styles } from "../ViewConstructors/Modifiers/CSS/Styles"
import { ViewElementsContainer, ElementsContainerListeners } from "../ViewConstructors/ViewElementsContainer"
import { PhoneNumber, Email, URIBuilder } from "../Data/URI"





/** 
 * Referrer Policy
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
 */
 export enum ReferrerPolicyOptions {
	/** meaning that the Referer: HTTP header will not be sent */
	noReferrer = 'no-referrer',
	/** meaning that the referrer will be the origin of the page, that is roughly the scheme, the host and the port */
	origin = 'origin',
	/** meaning that the referrer will include the origin and the path (but not the fragment, password, or username). This case is unsafe as it can leak path information that has been concealed to third-party by using TLS. */
	unsafeUrl = 'unsafe-url'
}


export interface LinkAttribute extends ElementAttributeInterface {
	referrerPolicy?: ReferrerPolicyOptions
	hreflang?: string
	target?: LinkTarget
	href?: string | URL
	download?: boolean | string
}











export class LinkView extends ViewElementsContainer<HTMLAnchorElement> {
	protected HTMLElement?: HTMLAnchorElement

	protected styles: Styles<ElementsContainerStyles> = new Styles
	protected listeners: Listeners<ElementsContainerListeners<HTMLAnchorElement>> = new Listeners
	protected attribute: ElementAttribute<LinkAttribute> = new ElementAttribute



	protected merge?(): void
	protected generateHTMLElement(): HTMLAnchorElement {
		let element = document.createElement('a');
		return element
	}



	public referrerPolicy(value: ReferrerPolicyOptions): this { this.attribute.set('referrerPolicy', value); return this }
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