import type { ViewBuilder } from "../ViewConstructors/ViewBuilder";
import type { ElementAttribute } from "../ViewConstructors/Styles/Attributes";
import type { Listeners } from "../ViewConstructors/Styles/Listeners";
import { Styles } from "../ViewConstructors/Styles/Styles";
import { ViewSubElements, SubElementsStyles, SubElementsListeners } from "../ViewConstructors/ViewSubElements";





export class ButttonView extends ViewSubElements {
	protected HTMLElement?: HTMLButtonElement

	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<HTMLButtonElement>>
	protected attribute?: ElementAttribute<any>





	public render(newRender?: ButttonView, withAnimatiom?: boolean): HTMLButtonElement {

		// first render
		if (!this.HTMLElement) {
			if (newRender) { this.importProperty(newRender); newRender = undefined; }
			this.HTMLElement = document.createElement('button');
			this.renderModifiers(this.HTMLElement, undefined, withAnimatiom);
			this.renderMainElement(this.HTMLElement, this.generateContentElements(this.content));

			return this.HTMLElement
		}

		// not change
		if (!newRender) {
			this.renderModifiers(this.HTMLElement);
			return this.HTMLElement
		}

		// changes
		this.renderMainElement(this.HTMLElement, this.generateContentElements(this.content, newRender.content, true));
		this.renderModifiers(this.HTMLElement, newRender, withAnimatiom);
		return this.HTMLElement;
	}

	constructor(action: () => void, elements: (ViewBuilder | undefined)[]) {
		super(elements);
		this.styles.set('touch-action','none');
		this.safeListeners.set('click', () => action());
	}
}

export function Button(action: () => void): (...elements: (ViewBuilder | undefined)[]) => ButttonView { return (...elements) => new ButttonView(action, elements) }