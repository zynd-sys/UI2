import type { ViewBuilder } from "../ViewConstructors/ViewBuilder"
import { ElementAttributeInterface, ElementAttribute } from "../ViewConstructors/Modifiers/Attributes"
import { Listeners } from "../ViewConstructors/Modifiers/Listeners/Listeners"
import { Styles } from "../ViewConstructors/Modifiers/Styles"
import { ViewSubElements, SubElementsStyles, SubElementsListeners } from "../ViewConstructors/ViewSubElements"




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

export enum LinkTarget {
	sefl = '_self',
	blank = '_blank',
	parent = '_parent',
	top = '_top'
}

export interface LinkAttribute extends ElementAttributeInterface {
	referrerPolicy?: ReferrerPolicyOptions
	hreflang?: string
	target?: LinkTarget
	href?: string | URL
	download?: boolean | string
}






export class LinkView extends ViewSubElements<HTMLAnchorElement> {
	protected HTMLElement?: HTMLAnchorElement

	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners: Listeners<SubElementsListeners<HTMLAnchorElement>> = new Listeners
	protected attribute: ElementAttribute<LinkAttribute> = new ElementAttribute

	// protected destination: string

	protected merge?(): void
	// protected merge(newRender:LinkView,element:HTMLAnchorElement): void {
	// 	if(newRender.destination != element.href) element.href = this.destination = newRender.destination;
	// }
	// protected importProperty(view:LinkView):void {
	// 	this.destination = view.destination;
	// 	return super.importProperty(view)
	// }
	protected generateHTMLElement(): HTMLAnchorElement {
		let element = document.createElement('a');
		// element.href = this.destination;
		return element
	}



	public referrerPolicy(value: ReferrerPolicyOptions): this { this.attribute.set('referrerPolicy', value); return this }
	public pathLang(value: string): this { this.attribute.set('hreflang', value); return this }
	public target(value: LinkTarget): this { this.attribute.set('target', value); return this }
	public download(value: boolean | string = true): this { if (value == true || typeof value == 'string') this.attribute.set('download', value); return this }




	constructor(path: string | URL, elements: (ViewBuilder | undefined)[], action?: (event: Event) => void) {
		super(elements);
		this.attribute.set('href', path)
		if (action) this.listeners.set('click', (_, event) => action(event));
	}
}


export function Link(href: string | URL, action?: (event: Event) => void): (...elements: (ViewBuilder | undefined)[]) => LinkView { return (...elements) => new LinkView(href, elements, action) }

Link.Phone = (phone: string, action?: (event: Event) => void) => { return (...elements: (ViewBuilder | undefined)[]) => new LinkView(`tel:${phone}`, elements, action) }
Link.Mail = (mail: string, action?: (event: Event) => void) => { return (...elements: (ViewBuilder | undefined)[]) => new LinkView(`mailto:${mail}`, elements, action) }
Link.Download = (path: string | URL, fileName?: string, action?: (event: Event) => void) => { return (...elements: (ViewBuilder | undefined)[]) => new LinkView(path, elements, action).download(fileName ? fileName : true) }