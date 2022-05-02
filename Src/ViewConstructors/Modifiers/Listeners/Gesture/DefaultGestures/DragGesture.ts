import { GestureClass } from '../Gesture';
import { Point } from '../Point';



class DragGestureState {
	/** relative */
	public translate: Point = new Point(0, 0)
	/** relative */
	public time: number = 0
	public startTime: number
	public startElementPosition: Point

	constructor(startElementPosition: Point, startTime: number) {
		this.startElementPosition = startElementPosition;
		this.startTime = startTime;
	}
}





export class DragGesture extends GestureClass<DragGestureState> {
	protected isGestureEnded: boolean = false
	protected state?: DragGestureState
	protected pointerID?: number


	protected clearData() {
		this.isGestureEnded = false;
		this.state = undefined;
		this.pointerID = undefined;
	}


	protected onDown(event: PointerEvent): void {
		const element = event.currentTarget;
		if (!(element instanceof HTMLElement)) return

		element.setPointerCapture(event.pointerId);
		this.pointerID = event.pointerId;

		this.state = new DragGestureState(
			new Point(
				element.offsetLeft + event.offsetX,
				element.offsetTop + event.offsetY
			),
			event.timeStamp
		)

		this.onChangeHandler?.(this.state);
	}
	protected onMove(event: PointerEvent): void {
		if (this.pointerID != event.pointerId || !this.state) return

		const state = this.state;
		state.time = event.timeStamp - state.startTime;
		state.translate = new Point(
			event.pageX - state.startElementPosition.x,
			event.pageY - state.startElementPosition.y
		)

		this.onChangeHandler?.(this.state);
	}

	protected onUp(event: PointerEvent): void {
		if (event.pointerId == this.pointerID) {
			if (this.state) this.onEndHandler?.(this.state);
			this.clearData()
		}
	}
	protected onCancle(): void { this.clearData() }
}


