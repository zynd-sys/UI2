import type { ElementAttribute, ElementAttributeInterface } from "../../ViewConstructors/Modifiers/Attributes"
import type { Listeners } from "../../ViewConstructors/Modifiers/Listeners/Listeners"
import type { ViewBuilder } from "../../ViewConstructors/ViewBuilder"
import type { SubElementsListeners, SubElementsStyles } from "../../ViewConstructors/ViewSubElements"
import type { SpanView } from "./Span"
import { Styles } from "../../ViewConstructors/Modifiers/Styles"
import { ToggleStyle, ToggleStyleInterface } from "./Styles/ToggleStyle"
import { ViewFormElement } from "../../ViewConstructors/ViewFormElement"
import { Color } from "../../ViewConstructors/Modifiers/Colors/Colors"
import { Binding as BindingObserve, isObserved } from "../../Data/Observed"



























export class ToggleView extends ViewFormElement<{ input: HTMLInputElement, parent: HTMLLabelElement }> {

	protected HTMLElement?: { input: HTMLInputElement, parent: HTMLLabelElement }

	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>

	protected state: boolean
	protected elementStyle: ToggleStyleInterface = ToggleStyle.Switch
	protected userHandler: (value: boolean) => void





	protected override importProperty(view: ToggleView) {
		this.userHandler = view.userHandler;
		this.state = view.state;
		return super.importProperty(view)
	}




	protected generateAlternativeElement(accentColorValue: Color): SpanView { return this.elementStyle(accentColorValue, this.state) }
	protected generateHiddenElement() {
		let element = document.createElement('input');
		element.type = 'checkbox';
		element.addEventListener('change', e => {
			this.state = (e.currentTarget as HTMLInputElement).checked;
			this.safeUpdate(() => this.userHandler(this.state));
		});
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





	constructor(value: BindingObserve<boolean> | { value: boolean, onChange: (value: boolean) => void }, elements: (ViewBuilder | undefined)[]) {
		super(elements);
		this.state = value.value;
		this.direction(undefined, true);
		this.userHandler = isObserved(value)
			? (v: boolean) => value.value = v
			: value.onChange;
	}
}

export function Toggle(value: BindingObserve<boolean> | { value: boolean, onChange: (value: boolean) => void }): (...elements: (ViewBuilder | undefined)[]) => ToggleView { return (...elements) => new ToggleView(value, elements) }