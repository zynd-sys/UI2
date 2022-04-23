import type { ui2Event } from './ui2Event';
import { GestureClass } from './Gesture';
import { Point } from './Point';



interface DragGestureState {
	start: Point
	offset: Point
	offsetAtElement: Point
}


class DragGesture extends GestureClass<DragGestureState> {
	protected startPoin = new Point(0, 0)
	protected onDown(event: ui2Event): void { this.startPoin = event.point; this.updateState({ start: this.startPoin, offset: event.point, offsetAtElement: event.offsetAtElement }) }
	protected onMove(event: ui2Event): void { this.updateState({ start: this.startPoin, offset: event.point, offsetAtElement: event.offsetAtElement }) }
	protected onUp(event: ui2Event): void { this.updateState({ start: this.startPoin, offset: event.point, offsetAtElement: event.offsetAtElement }, true) }
}
class LongTapGesture extends GestureClass<undefined> {
	protected duration: number
	protected timerID?: number
	protected onDown(): void {
		this.updateState(undefined);
		this.timerID = setTimeout(() => this.updateState(undefined, true), this.duration)
	}
	protected onMove(): void { return }
	protected onUp(): void { if (this.timerID) clearTimeout(this.timerID) }
	/** ms */
	constructor(duration: number) { super(); this.duration = duration; }
}




export class DefaultGestureClass {

	public DragGesture = DragGesture

	public LongTapGesture = LongTapGesture
}

export const DefaultGesture = new DefaultGestureClass