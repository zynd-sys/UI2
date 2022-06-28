import type { Align } from '../../Styles/CSS/Enums/Align';




export class ScrollIntoSelf implements ScrollIntoViewOptions {

	protected onEndScroll: () => void
	/** ↔︎ horizontal Align */
	public inline?: Align.start | Align.center | Align.end
	/** ↕︎ vertical Align */
	public block?: Align.start | Align.center | Align.end
	public behavior?: 'auto' | 'smooth'



	public render(element: HTMLElement): this {
		element.scrollIntoView(this);
		this.onEndScroll();
		return this
	}

	constructor(onEndScroll: () => void, inline?: Align.start | Align.center | Align.end, block?: Align.start | Align.center | Align.end, behavior?: 'auto' | 'smooth') {
		this.onEndScroll = onEndScroll;
		this.inline = inline;
		this.block = block;
		this.behavior = behavior;
	}
}

