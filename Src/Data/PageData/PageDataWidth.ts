import { Observed } from "../Observed";





export class PageDataWidthClass extends Observed.LightObserver {
	protected timeoutID?: number

	public value: number = window.innerWidth



	protected mainHandler(): void {
		if (this.value == window.innerWidth) return
		clearTimeout(this.timeoutID);
		this.timeoutID = setTimeout(() => this.action('value', window.innerWidth), 350);
	}

	constructor() {
		super();
		window.addEventListener('resize', () => this.mainHandler(), { passive: true })
	}
}
export const PageDataWidth = new PageDataWidthClass;