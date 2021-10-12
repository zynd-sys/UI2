import type { ElementAttribute, ElementAttributeInterface } from "../../ViewConstructors/Styles/Attributes";
import type { FormElementListeners } from "../../ViewConstructors/ViewFormElement";
import { Listeners } from "../../ViewConstructors/Styles/Listeners/Listeners";
import { Styles, StylesInterface } from "../../ViewConstructors/Styles/Styles";
import { ViewTextModifiers } from "../../ViewConstructors/ViewTextModifiers";





export enum DatePickerType {
	time = 'time',
	date = 'date',
	datetime = 'datetime-local'
}




export interface DatePickerAttribute extends ElementAttributeInterface {
	'max'?: Date
	'min'?: Date
	'step'?: number
	'type'?: DatePickerType
}







export class DatePickerView extends ViewTextModifiers<HTMLInputElement> {
	protected HTMLElement?: HTMLInputElement

	protected styles: Styles<StylesInterface> = new Styles
	protected listeners: Listeners<FormElementListeners<HTMLInputElement>> = new Listeners
	protected attribute?: ElementAttribute<DatePickerAttribute>

	protected content: Date




	protected generateHTMLElement(): HTMLInputElement {
		let element = document.createElement('input');
		element.type = 'date';
		element.valueAsDate = this.content
		return element
	}
	protected merge(newRender: DatePickerView, element: HTMLInputElement): void {
		let data = element.valueAsDate;
		if (newRender.content.getTime() != data?.getTime()) element.valueAsDate = this.content = newRender.content
	}




	public type(value: DatePickerType): this { this.safeAttribute.set('type', value); return this }
	public min(value?: Date): this { if (value) this.safeAttribute.set('min', value); return this }
	public max(value?: Date): this { if (value) this.safeAttribute.set('max', value); return this }
	// /** 
	//  * * type == time — 1 ms
	//  * * type == date — 1 day
	//  */
	// public step(value?: number): this { if (value) this.safeAttribute.set('step', value); return this }


	constructor(value: Date, onChange: (value: Date) => void) {
		super();
		this.content = value;
		this.listeners.set('change', element => { this.content = element.valueAsDate || value; onChange(this.content) })
	}
}


export function DatePicker(value: Date, onChange: (value: Date) => void): DatePickerView { return new DatePickerView(value, onChange) }