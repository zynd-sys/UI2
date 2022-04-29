import type { ViewBuilder } from '../ViewConstructors/ViewBuilder';
import type { ElementAttribute } from '../ViewConstructors/Modifiers/Attributes';
import type { ElementsContainerStyles } from '../ViewConstructors/Modifiers/CSS/Types/ElementsContainerStyles';
import type { ButtonActionStyles } from '../ViewConstructors/Modifiers/CSS/Types/ButtonActionStyles';
import { Listeners } from '../ViewConstructors/Modifiers/Listeners/Listeners';
import { Styles } from '../ViewConstructors/Modifiers/CSS/Styles';
import { ViewElementsContainer, ElementsContainerListeners } from '../ViewConstructors/ViewElementsContainer';
import { MainStyleSheet } from '../ViewConstructors/Modifiers/CSS/MainStyleSheet';
import { CSSSelectore } from '../ViewConstructors/Modifiers/CSS/CSSSelectore';
import { Direction } from '../ViewConstructors/Enum/Direction';
import { DefaultColor } from '../ViewConstructors/Modifiers/Colors/DefaultColors';





export interface ButtonActionInterface {
	onClick(): void
	elements?(): (ViewBuilder | undefined)[] | void
	styles?(styles: Styles<ButtonActionStyles>): void
}



MainStyleSheet.add(
	new CSSSelectore('button.container', {
		'border-radius': 0,
		'font': 'inherit',
		'outline': 'none',
		'box-shadow': 'none',
		'background-color': DefaultColor.transparent,
		'flex-direction': Direction.horizontal,
		'max-inline-size': '100%',
		'inline-size': 'max-content',
		'cursor': 'pointer'
	})
);






export class ButttonView extends ViewElementsContainer<HTMLButtonElement> {
	protected HTMLElement?: HTMLButtonElement

	protected styles: Styles<ElementsContainerStyles> = new Styles
	protected listeners: Listeners<ElementsContainerListeners<HTMLButtonElement>> = new Listeners
	protected attribute?: ElementAttribute<any>
	protected actionInterface?: true

	protected override importProperty(view: ButttonView): void {
		this.actionInterface = view.actionInterface;
		return super.importProperty(view);
	}

	protected merge?(): void
	protected generateHTMLElement(): HTMLButtonElement { return document.createElement('button') }

	public override elements(...value: (ViewBuilder | undefined)[]): this { if (!this.actionInterface) this.content.replace(value); return this }
	public override onClick(): this { return this }

	constructor(action: (() => void) | ButtonActionInterface | undefined, elements: (ViewBuilder | undefined)[]) {
		super(elements);
		this.styles.set('touch-action', 'none');

		if (!action) return this
		if (typeof action == 'function') { this.listeners.set('click', () => action()); return this }

		this.actionInterface = true;
		let actionElements = action.elements ? action.elements() : undefined;
		if (actionElements) this.content.replace(actionElements);
		this.listeners.set('click', () => action.onClick());
		if (action.styles) action.styles(this.styles as Styles<ButtonActionStyles>);
	}
}

export function Button(action?: (() => void) | ButtonActionInterface): (...elements: (ViewBuilder | undefined)[]) => ButttonView { return (...elements) => new ButttonView(action, elements) }