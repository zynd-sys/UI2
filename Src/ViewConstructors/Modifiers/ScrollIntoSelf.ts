import type { Align } from '../Enum/Align';




export class ScrollIntoSelf implements ScrollIntoViewOptions {

	constructor(
		protected onEndScroll: () => void,
		/** ↔︎ horizontal Align */
		public inline?: Align.start | Align.center | Align.end,
		/** ↕︎ vertical Align */
		public block?: Align.start | Align.center | Align.end,
		public behavior?: 'auto' | 'smooth'
	) {}


	public render(element:HTMLElement):this {
		element.scrollIntoView(this);
		this.onEndScroll();
		return this
	}
}

