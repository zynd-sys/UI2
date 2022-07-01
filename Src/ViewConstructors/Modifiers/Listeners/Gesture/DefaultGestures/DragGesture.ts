import { GestureClass } from '../Gesture';
import { Point } from '../Point';



class DragGestureState {
	/** relative */
	public translate: Point
	/** relative */
	public time: number = 0
	public readonly startElementRect: { width: number, height: number }
	public readonly startTime: number
	public readonly startElementPosition: Point

	constructor(startElementPosition: Point, translate: Point, startElementRect: { width: number, height: number }, startTime: number) {
		this.startElementPosition = startElementPosition;
		this.startElementRect = startElementRect;
		this.translate = translate;
		this.startTime = startTime;
	}
}





export class DragGesture extends GestureClass<DragGestureState> {
	protected isGestureEnded: boolean = false
	protected state?: DragGestureState
	protected pointerID?: number


	protected clearData(): void {
		this.isGestureEnded = false;
		this.state = undefined;
		this.pointerID = undefined;
	}


	protected onDown(event: PointerEvent): void {
		const element = event.currentTarget;
		if (!(element instanceof HTMLElement) || this.pointerID) return

		element.setPointerCapture(event.pointerId);
		this.pointerID = event.pointerId;
		const transform = new DOMMatrixReadOnly(window.getComputedStyle(element).transform);
		const rect = element.getBoundingClientRect();

		const startX = rect.left - transform.e + event.offsetX;
		const startY = rect.top - transform.f + event.offsetY;

		const state = new DragGestureState(
			new Point(
				startX,
				startY
			),
			new Point(
				event.pageX - startX,
				event.pageY - startY
			),
			{
				width: rect.width,
				height: rect.height
			},
			event.timeStamp
		)

		this.state = state;

		this.onChangeHandler?.(state);
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


