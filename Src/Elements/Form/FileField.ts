import type { ViewBuilder } from "../../ViewConstructors/ViewBuilder"
import { FormElementListeners, SpanView, ViewFormElement } from "../../ViewConstructors/ViewFormElement"
import { ElementAttributeInterface, ElementAttribute } from "../../ViewConstructors/Modifiers/Attributes"
import { Listeners } from "../../ViewConstructors/Modifiers/Listeners/Listeners"
import { Styles, StylesInterface } from "../../ViewConstructors/Modifiers/Styles"






export interface FileFielAttributes extends ElementAttributeInterface {
	type?: 'file'
	accept?: string
	multiple?: boolean
}



export class FileFieldView extends ViewFormElement<{ parent: HTMLLabelElement, input: HTMLInputElement }> {
	protected merge?(): void
	protected generateAlternativeElement?(): SpanView
	protected generateHiddenElement(): HTMLInputElement {
		let element = document.createElement('input');
		element.type = 'file';
		return element
	}
	protected HTMLElement?: { parent: HTMLLabelElement, input: HTMLInputElement }

	protected styles: Styles<StylesInterface> = new Styles
	protected listeners: Listeners<FormElementListeners<HTMLLabelElement>> = new Listeners
	protected attribute: ElementAttribute<FileFielAttributes> = new ElementAttribute



	/** @param value defualt true */
	public multipleFiles(value: boolean = true): this { this.attribute.set('multiple', value); return this }
	/** 
	 * @param values MimeType or "audio/*", "video/*", "image/*"
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
	 */
	public acceptFile(...values: string[]): this { this.attribute.set('accept', values.join(',')); return this }










	constructor(onChange: (value: FileList) => void, elements: (ViewBuilder | undefined)[]) {
		super(elements);
		this.listeners.set('change', element => {
			let fileList = (element.control as HTMLInputElement | null)?.files;
			if (!fileList) throw new Error('not found file list')
			onChange(fileList);
		})
	}
}

export function FileField(onChange: (value: FileList) => void): (...elements: (ViewBuilder | undefined)[]) => FileFieldView { return (...elements) => new FileFieldView(onChange, elements) }