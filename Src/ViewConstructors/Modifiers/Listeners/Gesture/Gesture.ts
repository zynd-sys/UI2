import type { ui2Event } from './ui2Event';






export enum GestureActionType {
	up,
	down,
	move
}







/** @see https://webkit.org/blog/5610/more-responsive-tapping-on-ios/ */
export abstract class GestureClass<S> {

	private endAnimation: boolean = false
	private pointers: number = 0


	protected onChangeHandler?: (state: S) => void
	protected onEndHandler?: (state: S) => void
	protected sequencedValue?: GestureClass<any>
	protected simultaneouslyValue?: GestureClass<any>



	public onChange(value: (state: S) => void): this { this.onChangeHandler = value; return this }
	public onEnd(value: (state: S) => void): this { this.onEndHandler = value; return this }
	public sequenced(value: GestureClass<any>): this { this.sequencedValue = value; return this }
	public simultaneously(value: GestureClass<any>): this { this.simultaneouslyValue = value; return this }



	protected abstract onDown(event: ui2Event): void
	protected abstract onMove(event: ui2Event): void
	protected abstract onUp(event: ui2Event): void

	protected updateState(state: S, end: boolean = false): void {
		if (end) { if (this.onEndHandler) this.onEndHandler(state); this.endAnimation = true; return }
		if (this.onChangeHandler) this.onChangeHandler(state);
	}


	public update(eventType: GestureActionType, event: ui2Event): void {
		this.simultaneouslyValue?.update(eventType, event);

		if (this.pointers == 0) this.endAnimation = false;
		if (eventType == GestureActionType.down) { this.pointers += 1; if (!this.endAnimation) return this.onDown(event) }
		if (eventType == GestureActionType.up) { this.pointers -= 1; if (!this.endAnimation) return this.onUp(event) };

		if (this.endAnimation) return this.sequencedValue?.update(eventType, event);
		if (eventType == GestureActionType.move) return this.onMove(event)
	}
}