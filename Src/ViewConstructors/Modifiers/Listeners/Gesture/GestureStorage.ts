import { GestureClass } from './Gesture'




class GestureListners {
	protected pointersCount: number = 0
	protected startingGesture: GestureClass<any>[]
	protected activeGesture: GestureClass<any>[] = []

	public pointerDown = (event: PointerEvent): void => {
		if (this.pointersCount == 0) this.activeGesture = Array.from(this.startingGesture);
		this.pointersCount = this.pointersCount + 1;
		(event.currentTarget as HTMLElement)?.setPointerCapture(event.pointerId)

		for (let i = 0; i < this.activeGesture.length; i++)
			try {
				const gesture = this.activeGesture[i]!;
				let result = GestureClass.updateOnDown(gesture, event);
				if (result) this.activeGesture.splice(i, 1, ...result);
			}
			catch (error) { console.error(error) }
	}
	public pointerUp = (event: PointerEvent): void => {
		this.pointersCount = this.pointersCount - 1;

		for (let i = 0; i < this.activeGesture.length; i++)
			try {
				const gesture = this.activeGesture[i]!;
				let result = GestureClass.updateOnUp(gesture, event);
				if (result) this.activeGesture.splice(i, 1, ...result);
			}
			catch (error) { console.error(error) }

		if (this.pointersCount == 0) this.activeGesture = [];
	}
	public pointerMove = (event: PointerEvent): void => {
		if(this.pointersCount == 0) return
		for (let i = 0; i < this.activeGesture.length; i++)
			try {
				const gesture = this.activeGesture[i]!;
				let result = GestureClass.updateOnMove(gesture, event);
				if (result) this.activeGesture.splice(i, 1, ...result);
			}
			catch (error) { console.error(error) }
	}
	public pointerCancle = (event: PointerEvent): void => {
		this.pointersCount = 0;
		this.activeGesture = [];

		for (let i = 0; i < this.activeGesture.length; i++)
			try { GestureClass.updateOnCancle(this.activeGesture[i]!, event); }
			catch (error) { console.error(error) }
	}



	public replaceGesture(gesture: GestureClass<any>[]): void { this.startingGesture = gesture; }

	constructor(gesture: GestureClass<any>[]) { this.startingGesture = gesture; }
}






class GestureStorageClass {
	protected storage: WeakMap<HTMLElement, GestureListners> = new WeakMap

	protected setHandlers(element: HTMLElement, handlers: GestureListners): void {
		element.addEventListener('pointerdown', handlers.pointerDown)
		element.addEventListener('pointermove', handlers.pointerMove)
		element.addEventListener('pointerup', handlers.pointerUp)
		element.addEventListener('pointercancel', handlers.pointerCancle)
	}
	protected removeHandlers(element: HTMLElement, handlers: GestureListners): void {
		element.removeEventListener('pointerdown', handlers.pointerDown)
		element.removeEventListener('pointermove', handlers.pointerMove)
		element.removeEventListener('pointerup', handlers.pointerUp)
		element.removeEventListener('pointercancel', handlers.pointerCancle)
	}



	public render(element: HTMLElement, gesture: GestureClass<any>[]): void {
		let handlers = this.storage.get(element);

		if (handlers) handlers.replaceGesture(gesture)
		else {
			handlers = new GestureListners(gesture);
			this.setHandlers(element, handlers);
			this.storage.set(element, handlers)
		}
	}
	public destroy(element: HTMLElement): void {
		let handlers = this.storage.get(element);
		if (handlers) this.removeHandlers(element, handlers);
	}
}

export const GestureStorage = new GestureStorageClass