import type { ElementAttribute, ElementAttributeInterface } from "../../ViewConstructors/Styles/Attributes"
import type { Listeners } from "../../ViewConstructors/Styles/Listeners"
import { ContentAlign } from "../../ViewConstructors/Enum/ContentAlign"
import { Side } from "../../ViewConstructors/Enum/Side"
import { SideBorderRadius } from "../../ViewConstructors/Enum/SideBorderRadius"
import { TimingFunction } from "../../ViewConstructors/Enum/TimingFunction"
import { Units } from "../../ViewConstructors/Enum/Units"
import { Styles } from "../../ViewConstructors/Styles/Styles"
import { ViewBuilder } from "../../ViewConstructors/ViewBuilder"
import { SubElementsListeners, SubElementsStyles, ViewSubElements } from "../../ViewConstructors/ViewSubElements"
import { Picture } from "../Picture"
import { StackView } from "../Stack"
import { hex } from "../../ViewConstructors/Styles/Colors/HEXColor"
import type { Color } from "../../ViewConstructors/Styles/Colors/Colors"
import { DefaultColor } from "../../ViewConstructors/Styles/Colors/DefaultColors"









export namespace ToggleStyle {

	export class SpanView extends StackView { HTMLTagName = 'span' as 'div' }
	export function Span(...elements: (ViewBuilder | undefined)[]): SpanView { return new SpanView(elements) }


	const borderColor = hex('#e7e7e7');
	// const backgroundColor = hex('#fff');
	const backgroundColor = DefaultColor.gray6;
	const shadowColor = hex('#000', .3);
	const f = hex('#fff')//.darkModeColor('#000')

	export function Switch(isOn: boolean, accentColor: Color) {
		return Span()
			.transition(300, TimingFunction.easeInOut)
			.height(1.25, Units.rem).width(2, Units.rem)
			.margin(Side.right, 0.5, Units.rem).margin(Side.topBottom, 0.5, Units.rem)
			.borderRadius(SideBorderRadius.all, 1, Units.rem)
			.backgroundColor(isOn ? accentColor : backgroundColor)
			.justifyContent(ContentAlign.start)
			.elements(
				Span()
					.transition(300, TimingFunction.easeInOut)
					.translateXEffect(isOn ? .875 : .125, Units.rem)
					.width(1, Units.rem).height(1, Units.rem)
					.dropShadowOffsetX(0.125, Units.rem).dropShadowOffsetY(0.125, Units.rem).dropShadowBlurRadius(0.125, Units.rem).dropShadowColor(shadowColor)
					.backgroundColor(f)
					.borderRadius(SideBorderRadius.all, 50, Units.absolute)
			)
	}


	export function Checkbox(isOn: boolean, accentColor: Color): SpanView {
		return Span()
			.transition(300, TimingFunction.easeInOut)
			.height(1.25, Units.rem).width(1.25, Units.rem)
			.margin(Side.right, 0.5, Units.rem).margin(Side.topBottom, 0.5, Units.rem)
			.borderWidth(Side.all, 0.125, Units.rem).borderStyle().borderColor(isOn ? accentColor : borderColor)
			.borderRadius(SideBorderRadius.all, 0.125, Units.rem)
			.backgroundColor(isOn ? accentColor : f)
			.elements(
				Picture('data:image/svg+xml,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white"/></svg>', '')
					.height(0.75, Units.rem).width(0.75, Units.rem)
			)
	}

	export function Radio(isOn: boolean, accentColor: Color): SpanView {
		return Span()
			.transition(300, TimingFunction.easeInOut)
			.height(1.25, Units.rem).width(1.25, Units.rem)
			.margin(Side.right, 0.5, Units.rem).margin(Side.topBottom, 0.5, Units.rem)
			.borderWidth(Side.all, 0.125, Units.rem).borderStyle().borderColor(isOn ? accentColor : borderColor)
			.borderRadius(SideBorderRadius.all, 50, Units.absolute)
			.backgroundColor(isOn ? accentColor : f)
			.elements(
				Span()
					.backgroundColor(f)
					.height(0.75, Units.rem).width(0.75, Units.rem)
					.borderRadius(SideBorderRadius.all, 50, Units.absolute)
			)
	}
}


















export class ToggleView extends ViewSubElements {

	protected HTMLElement?: { HTMLInput: HTMLInputElement, parent: HTMLLabelElement, toggleView: ToggleStyle.SpanView }

	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>

	protected state: boolean
	protected accentColorValue: Color = DefaultColor.blue
	protected toggle: (isOn: boolean, accentColor: Color) => ToggleStyle.SpanView = ToggleStyle.Switch
	protected userHandler: (value: boolean) => void
	protected isUpdating: boolean = false

	protected content: (ViewBuilder | undefined)[]




	protected importProperty(view: ToggleView) {
		this.toggle = view.toggle;
		this.userHandler = view.userHandler;
		this.accentColorValue = view.accentColorValue;
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


	public accentColor(value: Color): this { this.accentColorValue = value; return this }
	public toggleStyle(value: (isOn: boolean, accentColor: Color) => ToggleStyle.SpanView): this { this.toggle = value; return this }


	public render(newRender?: ToggleView, withAnimatiom?: boolean): HTMLLabelElement {
		this.isUpdating = true;

		// firs render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }

			this.HTMLElement = {
				parent: document.createElement('label'),
				HTMLInput: document.createElement('input'),
				toggleView: this.toggle(this.state, this.accentColorValue)
			};
			this.HTMLElement.HTMLInput.type = 'checkbox';
			this.HTMLElement.HTMLInput.addEventListener('change', this.mainHandler);
			this.HTMLElement.HTMLInput.checked = this.state
			this.renderModifiers(this.HTMLElement.parent, undefined, withAnimatiom)

			let htmlElements = this.generateContentElements(this.content);
			htmlElements.unshift(this.HTMLElement.HTMLInput, this.HTMLElement.toggleView.render());
			this.renderMainElement(this.HTMLElement.parent, htmlElements);

			return this.HTMLElement.parent
		}

		// no change
		if (!newRender) {
			this.renderModifiers(this.HTMLElement.parent);
			this.HTMLElement.toggleView.render(this.toggle(this.state, this.accentColorValue));
			return this.HTMLElement.parent
		}



		// changes
		this.toggle = newRender.toggle;
		this.userHandler = newRender.userHandler;
		this.state = newRender.state;
		if (this.state != this.HTMLElement.HTMLInput.checked) this.HTMLElement.HTMLInput.checked = this.state;

		let htmlElements = this.generateContentElements(this.content, newRender.content, true);
		htmlElements.unshift(this.HTMLElement.HTMLInput, this.HTMLElement.toggleView.render(this.toggle(this.state, this.accentColorValue)));
		this.renderMainElement(this.HTMLElement.parent, htmlElements);

		this.renderModifiers(this.HTMLElement.parent, newRender, withAnimatiom)
		return this.HTMLElement.parent
	}


	public destroy(withAnimatiom?: boolean): Promise<void> | void {
		let toggle = this.HTMLElement?.toggleView;
		this.HTMLElement?.HTMLInput.removeEventListener('change', this.mainHandler);
		if (withAnimatiom) return super.destroy(withAnimatiom)?.then(() => toggle?.destroy())
		return super.destroy(withAnimatiom)
	}



	constructor(value: boolean, onChange: (value: boolean) => void, elements: (ViewBuilder | undefined)[]) {
		super();
		this.state = value;
		this.userHandler = onChange;
		this.content = elements;
	}
}

export function Toggle(value: boolean, onChange: (value: boolean) => void): (...elements: (ViewBuilder | undefined)[]) => ToggleView { return (...elements) => new ToggleView(value, onChange, elements) }