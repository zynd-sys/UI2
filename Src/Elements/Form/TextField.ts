import type { Autocapitalize } from "../../ViewConstructors/Enum/Autocapitalize";
import type { FormElementListeners } from "../../ViewConstructors/ViewFormElement";
import { ElementAttributeInterface, ElementAttribute } from "../../ViewConstructors/Modifiers/Attributes";
import { Listeners } from "../../ViewConstructors/Modifiers/Listeners/Listeners";
import { Styles, StylesInterface } from "../../ViewConstructors/Modifiers/Styles";
import { ViewTextModifiers } from "../../ViewConstructors/ViewTextModifiers";
import { Binding as BindingObserve, isObserved } from "../../Data/Observed";






export interface TextFieldAttributes extends ElementAttributeInterface {
	'placeholder'?: string
	'type'?: KeyboardStyle
	'autocomplete'?: TextAutocomplete
	'maxlength'?: number
	'minlength'?: number
	'readonly'?: boolean
	'required'?: true
	'autocapitalize'?: Autocapitalize
}




/**
 * Input types
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types
 */
export enum KeyboardStyle {
	email = 'email',
	search = 'search',
	number = 'number',
	password = 'password',
	url = 'url',
	telephone = 'tel',
	text = 'text'
}

/** 
 * The HTML autocomplete attribute
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
*/
type TextAutocomplete = 'off' | 'on'
	// name
	| 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix'
	//email
	| 'email'
	// username
	| 'username'
	// password
	| 'new-password' | 'current-password' | 'one-time-code'
	// organization
	| 'organization' | 'organization-title'
	// address
	| 'street-address' | 'country' | 'country-name' | 'postal-code'
	// credit card
	| 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount'
	// language
	| 'language'
	// bday
	| 'bday' | 'bday-day' | 'bday-month' | 'bday-year'
	// sex
	| 'sex'
	// telephone
	| 'tel' | 'tel-country-code' | 'tel-area-code' | 'tel-national' | 'tel-local' | 'tel-extension';















/** @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement */
export class TextFieldView extends ViewTextModifiers<HTMLInputElement | HTMLTextAreaElement> {
	protected HTMLElement?: HTMLInputElement | HTMLTextAreaElement

	protected styles: Styles<StylesInterface> = new Styles
	protected listeners: Listeners<FormElementListeners<HTMLInputElement | HTMLTextAreaElement>> = new Listeners
	protected attribute: ElementAttribute<TextFieldAttributes> = new ElementAttribute
	protected isWrap: boolean = false


	protected content: string


	protected override importProperty(view: TextFieldView): void {
		this.isWrap = view.isWrap;
		return super.importProperty(view)
	}


	protected merge(newRender: TextFieldView, element: HTMLInputElement | HTMLTextAreaElement): void {
		this.content = newRender.content;
		if (this.isWrap != newRender.isWrap) {
			this.isWrap = newRender.isWrap;
			let newElement = document.createElement(this.isWrap ? 'textarea' : 'input')
			element.replaceWith(newElement);
			this.HTMLElement = element = newElement;
		}
		if (element.value != this.content) element.value = this.content;
	}
	protected generateHTMLElement(): HTMLInputElement | HTMLTextAreaElement {
		let element = document.createElement(this.isWrap ? 'textarea' : 'input');
		element.value = this.content;
		return element
	}










	// spellcheck?
	// public placeHolder(value?: string): this { if (value) this.attribute.set('placeholder', value); return this }
	/** @param value defualt true */
	public wrap(value: boolean = true): this { this.isWrap = value; return this }
	public maxLength(value: number): this { this.attribute.set('maxlength', value); return this }
	public minLength(value: number): this { this.attribute.set('minlength', value); return this }
	/** @param value defualt true */
	public required(value: boolean = true) { if (value) { this.attribute.set('required', true); this.listeners.set('invalid', (_, e) => e.preventDefault()) }; return this }
	/** @param value defualt true */
	public readOnly(value: boolean = true): this { if (value) this.attribute.set('readonly', value); return this }
	public keyboardStyle(value: KeyboardStyle, autocomplete?: TextAutocomplete, autocapitalize?: Autocapitalize): this {
		this.attribute.set('type', value);
		if (autocomplete) this.attribute.set('autocomplete', autocomplete);
		if (autocapitalize) this.attribute.set('autocapitalize', autocapitalize);
		return this
	}

	public onEndInput(value: (value: string) => void): this { this.listeners.set('change', () => value(this.content)); return this }
	/** @param value defualt true */
	public secureField(value: boolean = true, currentPassword: boolean = true): this { if (value) this.keyboardStyle(KeyboardStyle.password, currentPassword ? 'current-password' : 'new-password'); return this }







	constructor(placeHolder: string, value: BindingObserve<string> | { value: string, onChange: (value: string) => void }) {
		super();
		this.content = value.value;
		this.attribute.set('placeholder', placeHolder);
		this.attribute.set('type', KeyboardStyle.text);

		this.listeners.set('input', isObserved(value)
			? element => value.value = this.content = element.value
			: element => value.onChange(this.content = element.value)
		);
	}
}

export function TextField(placeHolder: string, value: BindingObserve<string> | { value: string, onChange: (value: string) => void }): TextFieldView { return new TextFieldView(placeHolder, value) }