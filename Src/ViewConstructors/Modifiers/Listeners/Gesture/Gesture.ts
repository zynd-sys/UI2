










/** @see https://webkit.org/blog/5610/more-responsive-tapping-on-ios/ */
export abstract class GestureClass<S> {

	protected abstract isGestureEnded: boolean
	protected abstract state?: S

	protected onChangeHandler?: (state: S) => void
	protected onEndHandler?: (state: S) => void
	protected sequencedGesture?: GestureClass<any>[]


	static updateOnUp(gesture: GestureClass<any>, event: PointerEvent): void | GestureClass<any>[] {
		gesture.onUp(event);
		if (gesture.isGestureEnded) return gesture.sequencedGesture || [];
	}
	static updateOnMove(gesture: GestureClass<any>, event: PointerEvent): void | GestureClass<any>[] {
		gesture.onMove(event);
		if (gesture.isGestureEnded) return gesture.sequencedGesture || [];
	}
	static updateOnDown(gesture: GestureClass<any>, event: PointerEvent): void | GestureClass<any>[] {
		gesture.onDown(event);
		if (gesture.isGestureEnded) return gesture.sequencedGesture || [];
	}
	static updateOnCancle(gesture: GestureClass<any>, event: PointerEvent): void | GestureClass<any>[] {
		gesture.onCancle(event);
	}




	protected abstract onDown(event: PointerEvent): void
	protected abstract onMove(event: PointerEvent): void
	protected abstract onUp(event: PointerEvent): void
	protected abstract onCancle(event: PointerEvent): void




	public onChanged(value: (state: S) => void): this { this.onChangeHandler = value; return this }
	public onEnded(value: (state: S) => void): this { this.onEndHandler = value; return this }
	public sequenced(...value: GestureClass<any>[]): this { this.sequencedGesture = value; return this }
}