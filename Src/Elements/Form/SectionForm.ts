import type { ElementAttribute, ElementAttributeInterface } from '../../ViewConstructors/Modifiers/Attributes';
import type { Listeners } from '../../ViewConstructors/Modifiers/Listeners/Listeners';
import type { ViewBuilder } from '../../ViewConstructors/ViewBuilder';
import type { ElementsContainerStyles } from '../../Styles/CSS/Types';
import { StackView } from '../Stack';
import { TextsView } from '../Texts';
import { ElementsContainerListeners, ViewElementsContainer } from '../../ViewConstructors/ViewElementsContainer';
import { MainStyleSheet, CSSSelectore } from '../../Styles/CSS';
import { Styles } from '../../ViewConstructors/Modifiers/Styles';








MainStyleSheet.add(
	new CSSSelectore('fieldset,legend', { 'padding': 0 })
)




export class SectionFormView extends ViewElementsContainer<HTMLFieldSetElement> {
	protected HTMLElement?: HTMLFieldSetElement

	protected styles: Styles<ElementsContainerStyles> = new Styles
	protected listeners?: Listeners<ElementsContainerListeners<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>

	protected headerContent?: boolean
	protected footerContent?: boolean


	protected generateHTMLElement(): HTMLFieldSetElement { return document.createElement('fieldset') }
	protected merge(newRender: SectionFormView): void {
		if (this.headerContent != newRender.headerContent) this.headerContent = newRender.headerContent;
		if (this.footerContent != newRender.footerContent) this.headerContent = newRender.footerContent;
	}





	public header(value: StackView | TextsView | string): this {
		let content = value instanceof StackView ? value : new StackView([typeof value == 'string' ? new TextsView(value) : value]);
		content.tagName('legend');
		this.content.unshift(content);
		this.headerContent = true;
		return this
	}
	public footer(value: StackView | TextsView | string): this {
		this.content.push(value instanceof StackView ? value : new StackView([typeof value == 'string' ? new TextsView(value) : value]))
		this.footerContent = true;
		return this
	}
	public override elements(...values: (ViewBuilder | undefined)[]): this {
		const headerContent = this.headerContent ? 1 : 0;
		this.content.splice(
			headerContent,
			this.footerContent ? this.content.length() - 2 - (headerContent) : 0,
			...values
		);
		return this
	}

	// public disabled(value: boolean, action?: (element: this) => void): this { }







	constructor(elements: (ViewBuilder | undefined)[], header?: StackView | TextsView | string, footer?: StackView | TextsView | string) {
		super(elements);
		if (header) this.header(header);
		if (footer) this.footer(footer);
	}
}
export function SectionForm(header?: StackView | TextsView | string, footer?: StackView | TextsView | string): (...element: (ViewBuilder | undefined)[]) => SectionFormView {
	return (...elements) => new SectionFormView(elements, header, footer);
}