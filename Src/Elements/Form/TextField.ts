import type { SubElementsListeners } from "../../ViewConstructors/ViewSubElements";
import { ElementAttributeInterface, ElementAttribute } from "../../ViewConstructors/Styles/Attributes";
import { Listeners } from "../../ViewConstructors/Styles/Listeners";
import { Styles, StylesInterface } from "../../ViewConstructors/Styles/Styles";
import { ViewTextModifiers } from "../../ViewConstructors/ViewTextModifiers";





export interface HTMLInputListeners<E extends HTMLElement> extends SubElementsListeners<E> {
	change?: (element: E, event: Event) => void
	input?: (element: E, event: Event) => void
}
export interface TextFieldAttributes extends ElementAttributeInterface {
	placeholder?: string
	type?: KeyboardStyle
	autocomplete?: TextAutocomplete
	maxlength?: number
	minlength?: number
	readonly?: boolean
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
export class TextFieldView extends ViewTextModifiers {
	protected HTMLElement?: HTMLInputElement | HTMLTextAreaElement

	protected styles: Styles<StylesInterface> = new Styles
	protected listeners: Listeners<HTMLInputListeners<HTMLInputElement>> = new Listeners
	protected attribute: ElementAttribute<TextFieldAttributes> = new ElementAttribute
	protected isWrap: boolean = false


	protected content: string


	protected importProperty(view: TextFieldView): void {
		this.isWrap = view.isWrap;
		return super.importProperty(view)
	}


	// spellcheck?
	// public placeHolder(value?: string): this { if (value) this.attribute.set('placeholder', value); return this }
	/** @param value defualt true */
	public wrap(value: boolean = true): this { this.isWrap = value; return this }
	public maxLength(value: number): this { this.attribute.set('maxlength', value); return this }
	public minLength(value: number): this { this.attribute.set('minlength', value); return this }
	/** @param value defualt true */
	public readOnly(value: boolean = true): this { if (value) this.attribute.set('readonly', value); return this }
	public keyboardStyle(value: KeyboardStyle, autocomplete?: TextAutocomplete): this {
		this.attribute.set('type', value);
		if (autocomplete) this.attribute.set('autocomplete', autocomplete);
		return this
	}

	public onEndInput(value: (value: string) => void): this { this.listeners.set('change', () => value(this.content)); return this }
	// public onInput(value: (value: string) => void): this { this.listeners.set('input', element => { this.content.value = element.value; this.content.userInput = true; value(this.content.value) }); return this }




	public render(newRender?: TextFieldView, withAnimatiom?: boolean): HTMLElement | HTMLTextAreaElement {

		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			this.HTMLElement = document.createElement(this.isWrap ? 'textarea' : 'input');
			this.HTMLElement.value = this.content;

			this.renderModifiers(this.HTMLElement, undefined, withAnimatiom);
			return this.HTMLElement
		}

		// not update
		if (!newRender) {
			this.renderModifiers(this.HTMLElement)
			return this.HTMLElement
		}


		// update
		this.content = newRender.content;
		if (this.isWrap != newRender.isWrap) {
			this.isWrap = newRender.isWrap;
			let newElement = document.createElement(this.isWrap ? 'textarea' : 'input')
			this.HTMLElement.replaceWith(newElement);
			this.HTMLElement = newElement;
		}
		if (this.HTMLElement.value != this.content) this.HTMLElement.value = this.content
		this.renderModifiers(this.HTMLElement, newRender, withAnimatiom);
		return this.HTMLElement
	}




	constructor(placeHolder: string, value: string, onInput: (value: string) => void) {
		super();
		this.content = value;
		this.attribute.set('placeholder', placeHolder);
		this.attribute.set('type', KeyboardStyle.text);

		this.listeners.set('input', element => onInput(this.content = element.value));
	}
}

export function TextField(placeHolder: string, value: string, onInput: (value: string) => void): TextFieldView { return new TextFieldView(placeHolder, value, onInput) }









// let inputElement = document.createElement('textarea');
// inputElement.style.display = 'block';
// inputElement.style.resize = 'none';
// // inputElement.style.width = '20px';
// inputElement.style.transition = 'all 600ms';
// inputElement.style.overflow = 'hidden';
// inputElement.style.padding = '4px'
// inputElement.rows = 2;
// inputElement.cols = 1;

// // let beforeinputValue: undefined | number = undefined;
// // inputElement.addEventListener('beforeinput', () => { if (inputElement.scrollHeight != inputElement.clientHeight) beforeinputValue = inputElement.scrollHeight })

// inputElement.addEventListener('input', () => {
// 	let startHeight = inputElement.clientHeight;
// 	inputElement.style.height = 'auto';

// 	console.log(inputElement.scrollHeight, inputElement.clientHeight)
// 	if (inputElement.scrollHeight != inputElement.clientHeight) {
// 		inputElement.animate({ height: [startHeight + 'px', inputElement.scrollHeight + 'px'] }, {
// 			duration: parseInt(inputElement.style.getPropertyValue('transition-duration')),
// 			composite: 'replace'
// 		}).onfinish = () => { inputElement.style.height = inputElement.scrollHeight + 'px' };
// 	}
// 	// inputElement.style.height = inputElement.scrollHeight + 'px'
// })
// document.body.style.height = '200vh';
// document.body.appendChild(inputElement)
// if (inputElement.scrollHeight > inputElement.clientHeight) inputElement.style.height = inputElement.scrollHeight + 'px'