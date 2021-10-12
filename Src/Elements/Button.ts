import type { ViewBuilder } from "../ViewConstructors/ViewBuilder";
import type { ElementAttribute } from "../ViewConstructors/Styles/Attributes";
import type { Listeners } from "../ViewConstructors/Styles/Listeners/Listeners";
import { Styles } from "../ViewConstructors/Styles/Styles";
import { ViewSubElements, SubElementsStyles, SubElementsListeners } from "../ViewConstructors/ViewSubElements";





export class ButttonView extends ViewSubElements<HTMLButtonElement> {
	protected HTMLElement?: HTMLButtonElement
	
	protected styles: Styles<SubElementsStyles> = new Styles
	protected listeners?: Listeners<SubElementsListeners<HTMLButtonElement>>
	protected attribute?: ElementAttribute<any>
	
	
	
	protected merge?(): void
	protected generateHTMLElement(): HTMLButtonElement { return document.createElement('button') }

	constructor(action: () => void, elements: (ViewBuilder | undefined)[]) {
		super(elements);
		this.styles.set('touch-action','none');
		this.safeListeners.set('click', () => action());
	}
}

export function Button(action: () => void): (...elements: (ViewBuilder | undefined)[]) => ButttonView { return (...elements) => new ButttonView(action, elements) }