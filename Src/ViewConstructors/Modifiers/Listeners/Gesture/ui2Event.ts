import { Point } from './Point'






export class ui2Event {
	/**
	 * The pointerType read-only property of interface indicates the device type that caused a given pointer event.
	 * * 'mouse' — The event was generated by a mouse device.
	 * * 'pen' — The event was generated by a pen or stylus device.
	 * * 'touch' — The event was generated by a touch, such as a finger.
	 *
	 * If the device type cannot be detected by the browser, the value can be an empty string (''). If the browser supports pointer device types other than those listed above, the value should be vendor-prefixed to avoid conflicting names for different types of devices.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
	 */
	public readonly pointerType: string
	/**
	 * The timeStamp read-only property returns the time (in milliseconds) at which the event was created.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp
	 */
	public readonly timeStamp: number
	public readonly pointerId: number

	public readonly offsetAtElement: Point
	public readonly point: Point
	// public readonly movement: Point
	// public readonly pointerHeight: number
	// public readonly pointerWidth: number
	// public readonly pagePoint: Point
	// public readonly screenPoint: Point


	constructor(e: PointerEvent) {
		this.pointerId = e.pointerId;
		this.pointerType = e.pointerType;
		this.timeStamp = e.timeStamp;
		this.offsetAtElement = new Point(e.offsetX, e.offsetY);
		this.point = new Point(e.clientX, e.clientY);
		// this.pointerHeight = e.height;
		// this.pointerWidth = e.width;
		// this.movement = new Point(e.movementX, e.movementY);
		// this.pagePoint = new Point(e.pageX, e.pageY);
		// this.screenPoint = new Point(e.screenX, e.screenY);
	}
}