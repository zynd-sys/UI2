import type { MinimalStylesInterface } from 'CSS/Types/MinimalStylesType'
import type { SecurityPolicyAttribute, SecurityPolicyViewModifiers, ElementAttribute } from 'ViewConstructors/Modifiers/Attributes'
import type { Listeners, LoadingResourceListeners, LoadingResourceModifiers } from 'ViewConstructors/Modifiers/Listeners/Listeners'
import type { Crossorigin } from 'Enum/Crossorigin'
import type { SandboxPermission } from 'Enum/SandboxPermission'
import type { ReferrerPolicyOptions } from 'Enum/ReferrerPolicyOptions'
import { Styles } from 'CSS/Styles'
import { ViewModifiers } from 'ViewConstructors/ViewModifiers'


declare global {
	interface HTMLIFrameElement {
		loading?: 'eager' | 'lazy'
	}
}

interface IframeAttributes extends SecurityPolicyAttribute {
	'allow'?: string
	'allowfullscreen'?: true
	'allowpaymentrequest'?: true
	'fetchpriority'?: 'high' | 'low' | 'auto'
	'loading'?: 'eager' | 'lazy'
	'sanbox'?: string
}





export class IframeView extends ViewModifiers<HTMLIFrameElement> implements SecurityPolicyViewModifiers, LoadingResourceModifiers {

	protected HTMLElement?: HTMLIFrameElement
	protected styles: Styles<MinimalStylesInterface> = new Styles
	protected listeners?: Listeners<LoadingResourceListeners<HTMLIFrameElement>>
	protected attribute?: ElementAttribute<IframeAttributes>


	protected content: string | URL

	protected generateHTMLElement(): HTMLIFrameElement {
		let element = document.createElement('iframe');
		element.src = this.content.toString();
		if (element.loading) element.loading = 'lazy';
		return element
	}
	protected merge(newRender: IframeView, HTMLElement: HTMLIFrameElement): void {
		if (this.content != newRender.content) { this.content = newRender.content; HTMLElement.src = this.content.toString() }
	}



	/** @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy */
	public featurePolicy(value: string): this { this.safeAttribute.set('allow', value); return this }
	public allowpaymentrequest(value: boolean = true): this { if (value) this.safeAttribute.set('allowpaymentrequest', true); return this }
	public allowfullscreen(value: boolean = true): this { if (value) this.safeAttribute.set('allowfullscreen', true); return this }
	public sandboxPermissions(...value: SandboxPermission[]): this { this.safeAttribute.set('sanbox', value.join(' ')); return this }
	public referrerPolicy(value: ReferrerPolicyOptions): this { this.safeAttribute.set('referrerpolicy', value); return this }
	public crossorigin(value: Crossorigin): this { this.safeAttribute.set('crossorigin', value); return this }
	public noLazyLoading(value: boolean = true): this { if (value) this.safeAttribute.set('loading', 'eager'); return this }
	// /** @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/fetchpriority */
	// public fetchpriority(value: 'high' | 'low' | 'auto'): this { }



	public onLoad(value: () => void): this { this.safeListeners.set('load', () => value()); return this }
	public onError(value: (error: any) => void): this { this.safeListeners.set('error', (_, event) => value(event.error)); return this }



	constructor(src: string | URL) {
		super();
		this.content = src;
	}
}

export function Ifrmae(src: string | URL): IframeView { return new IframeView(src) }