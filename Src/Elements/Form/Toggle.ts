import type { ElementAttribute, ElementAttributeInterface } from "../../ViewConstructors/Styles/Attributes"
import type { Listeners } from "../../ViewConstructors/Styles/Listeners/Listeners"
import type { ViewBuilder } from "../../ViewConstructors/ViewBuilder"
import type { SubElementsListeners, SubElementsStyles } from "../../ViewConstructors/ViewSubElements"
import { Styles } from "../../ViewConstructors/Styles/Styles"
import { ToggleStyle, ToggleStyleInterface } from "./Styles/ToggleStyle"
import { SpanView, ViewFormElement } from "../../ViewConstructors/ViewFormElement"
import { Color } from "../../ViewConstructors/Styles/Colors/Colors"
import { Observed } from "../../Data/Observed"



























export class ToggleView extends ViewFormElement<{ input: HTMLInputElement, parent: HTMLLabelElement }> {

	protected HTMLElement?: { input: HTMLInputElement, parent: HTMLLabelElement }

	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>
	protected elementStyleFirst: boolean = true

	protected state: boolean
	protected elementStyle: ToggleStyleInterface = ToggleStyle.Switch
	protected userHandler: (value: boolean) => void
	protected isUpdating: boolean = false





	protected importProperty(view: ToggleView) {
		this.userHandler = view.userHandler;
		this.state = view.state;
		return super.importProperty(view)
	}



	protected mainHandler = (e: Event) => {
		let value = (e.currentTarget as HTMLInputElement).checked;
		this.state = value;
		this.isUpdating = false;
		this.userHandler(value);
		if (this.HTMLElement && !this.isUpdating) this.render();
	}

	protected generateAlternativeElement(accentColorValue: Color): SpanView { return this.elementStyle(accentColorValue, this.state) }
	protected generateHiddenElement() {
		let element = document.createElement('input');
		element.classList.add('hiddenElement')
		element.type = 'checkbox';
		element.addEventListener('change', this.mainHandler);
		element.checked = this.state;
		return element
	}
	protected merge(newRender: ToggleView, element: { input: HTMLInputElement, parent: HTMLLabelElement }): void {
		this.elementStyle = newRender.elementStyle;
		this.userHandler = newRender.userHandler;
		this.state = newRender.state;
		if (this.state != element.input.checked) element.input.checked = this.state;
	}



	public toggleStyle(value: ToggleStyleInterface): this { this.elementStyle = value; return this }





	constructor(value: Observed.Binding<boolean> | { value: boolean, onChange: (value: boolean) => void }, elements: (ViewBuilder | undefined)[]) {
		super(elements);
		this.state = value.value;
		this.userHandler = Observed.isObserved(value)
			? (v: boolean) => value.value = v
			: value.onChange;
	}
}

export function Toggle(value: Observed.Binding<boolean> | { value: boolean, onChange: (value: boolean) => void }): (...elements: (ViewBuilder | undefined)[]) => ToggleView { return (...elements) => new ToggleView(value, elements) }