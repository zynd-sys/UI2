import type { ViewBuilder } from "../../ViewConstructors/ViewBuilder";
import type { ElementAttribute, ElementAttributeInterface } from "../../ViewConstructors/Modifiers/Attributes";
import { Listeners } from "../../ViewConstructors/Modifiers/Listeners/Listeners";
import { Styles } from "../../ViewConstructors/Modifiers/Styles";
import { SubElementsListeners, SubElementsStyles, ViewSubElements } from "../../ViewConstructors/ViewSubElements";







export interface FormListeners extends SubElementsListeners<HTMLFormElement> {
	'submit'?: (element: HTMLFormElement, event: Event) => any
}
export interface FormAttribute extends ElementAttributeInterface {
	'action'?: string
	'autocomplete'?: 'on' | 'off'
	'method'?: 'post' | 'get' | 'put' | 'delete'
	'encoding'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain'
}






export class FormView extends ViewSubElements<HTMLFormElement> {
	protected merge?(): void
	protected generateHTMLElement(): HTMLFormElement { return document.createElement('form') }
	protected HTMLElement?: HTMLFormElement

	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners: Listeners<FormListeners> = new Listeners
	protected attribute?: ElementAttribute<FormAttribute>


	public sendMethod(value: 'post' | 'get' | 'put' | 'delete'): this { this.safeAttribute.set('method', value); return this }
	public sendTarget(value: string): this { this.safeAttribute.set('action', value); return this }
	/**
	 * The property is the MIME type of content that is used to submit the form to the server. Possible values are:
	 * * application/x-www-form-urlencoded: The initial default type.
	 * * multipart/form-data: The type that allows file <input> element(s) to upload file data.
	 * * text/plain: A type introduced in HTML5.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/enctype
	 */
	public sendEncoding(value: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain'): this { this.safeAttribute.set('encoding', value); return this }
	/**
	 * Indicates whether input elements can by default have their values automatically completed by the browser. autocomplete attributes on form elements override it on . Possible values:
	 * * false: The browser may not automatically complete entries. (Browsers tend to ignore this for suspected login forms; see The autocomplete attribute and login fields.)
	 * * true: The browser may automatically complete entries.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-autocomplete
	 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#the_autocomplete_attribute_and_login_fields — How to turn off form autocompletion
	 */
	public autocomplete(value: boolean) { this.safeAttribute.set('autocomplete', value ? 'on' : 'off'); return this }





	constructor(onSubmit: () => boolean, elements: (ViewBuilder | undefined)[]) {
		super(elements);
		this.listeners.set('submit', (element, event) => {
			try {
				if (onSubmit()) {
					window.history.replaceState(undefined, '', window.location.pathname)
					element.reset();
				}
			}
			catch (error) { console.error(error) }
			finally { event.preventDefault() }
		})

	}
}

export function Form(onData: () => boolean): (...elements: (ViewBuilder | undefined)[]) => FormView { return (...elements) => new FormView(onData, elements) }