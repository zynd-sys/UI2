import type { ElementAttribute, ElementAttributeInterface } from '../../ViewConstructors/Modifiers/Attributes';
import type { FormElementListeners } from '../../ViewConstructors/ViewFormElement';
import type { MinimalStylesInterface } from '../../Styles/CSS/Types';
import { Listeners } from '../../ViewConstructors/Modifiers/Listeners/Listeners';
import { ViewTextModifiers } from '../../ViewConstructors/ViewTextModifiers';
import { MainStyleSheet, CSSSelectore } from '../../Styles/CSS';
import { Styles } from '../../ViewConstructors/Modifiers/Styles';





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


MainStyleSheet.add(new CSSSelectore('input[type=date]', { 'min-block-size': '54px' }))






export class DatePickerView extends ViewTextModifiers<HTMLInputElement> {
	protected HTMLElement?: HTMLInputElement

	protected styles: Styles<MinimalStylesInterface> = new Styles
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