import type { ViewBuilder } from "../../ViewConstructors/ViewBuilder"
import type { HTMLInputListeners } from "./TextField"
import { ElementAttributeInterface, ElementAttribute } from "../../ViewConstructors/Styles/Attributes"
import { Listeners } from "../../ViewConstructors/Styles/Listeners"
import { Styles, StylesInterface } from "../../ViewConstructors/Styles/Styles"
import { ViewSubElements } from "../../ViewConstructors/ViewSubElements"






export interface FileFielAttributes extends ElementAttributeInterface {
	type?: 'file'
	accept?: string
	multiple?: boolean
}



export class FileFieldView extends ViewSubElements {
	protected HTMLElement?: { parent: HTMLLabelElement, input: HTMLInputElement }

	protected styles: Styles<StylesInterface> = new Styles
	protected listeners: Listeners<HTMLInputListeners<HTMLLabelElement>> = new Listeners
	protected attribute: ElementAttribute<FileFielAttributes> = new ElementAttribute

	protected content: (ViewBuilder | undefined)[]


	/** @param value defualt true */
	public multipleFiles(value: boolean = true): this { this.attribute.set('multiple', value); return this }
	/** 
	 * @param values MimeType or "audio/*", "video/*", "image/*"
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
	 */
	public acceptFile(...values: string[]): this { this.attribute.set('accept', values.join(',')); return this }






	public render(newRender?: FileFieldView, withAnimatiom?: boolean): HTMLElement {

		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			this.HTMLElement = { parent: document.createElement('label'), input: document.createElement('input') }
			this.attribute.render(this.HTMLElement.input);

			let elements = this.generateContentElements(this.content);
			elements.push(this.HTMLElement.input);
			this.renderMainElement(this.HTMLElement.parent, elements);

			this.renderModifiers(this.HTMLElement.parent, undefined, withAnimatiom);
			return this.HTMLElement.parent
		}

		// not update
		if (!newRender) {
			this.renderModifiers(this.HTMLElement.parent);
			return this.HTMLElement.parent
		}

		// update
		let elements = this.generateContentElements(this.content, newRender.content, true);
		elements.push(this.HTMLElement.input);
		this.renderMainElement(this.HTMLElement.parent, elements);

		this.renderModifiers(this.HTMLElement.parent, newRender, withAnimatiom);
		this.attribute = newRender.attribute.render(this.HTMLElement.input);
		return this.HTMLElement.parent;
	}




	constructor(onChange: (value: FileList) => void, content: (ViewBuilder | undefined)[]) {
		super();
		this.content = content;
		this.attribute.set('type', 'file');
		this.listeners.set('change', element => {
			let fileList = (element.control as HTMLInputElement | null)?.files;
			if (!fileList) throw new Error('not found file list')
			onChange(fileList);
		})
	}
}

export function FileField(onChange: (value: FileList) => void): (...elements: (ViewBuilder | undefined)[]) => FileFieldView { return (...elements) => new FileFieldView(onChange, elements) }