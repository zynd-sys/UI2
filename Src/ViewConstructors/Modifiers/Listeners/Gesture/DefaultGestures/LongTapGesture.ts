import { GestureClass } from "../Gesture"


export class LongTapGesture extends GestureClass<void> {
	protected isGestureEnded: boolean = false
	protected state: undefined
	protected timerID?: number
	protected readonly duration: number

	protected onDown(): void {
		this.onChangeHandler?.()
		this.timerID = setTimeout(() => { this.isGestureEnded = true; this.onEndHandler?.() }, this.duration)
	}
	protected onMove(): void { }
	protected onUp(): void { this.isGestureEnded = false; if (this.timerID) clearTimeout(this.timerID) }
	protected onCancle(): void { this.isGestureEnded = false; if (this.timerID) clearTimeout(this.timerID) }

	/** ms */
	constructor(duration: number) { super(); this.duration = duration; }
}