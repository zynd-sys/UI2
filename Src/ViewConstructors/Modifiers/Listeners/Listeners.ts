
import type { GestureClass } from './Gesture/Gesture';
import { GestureListners } from './Gesture/GestureListners';
import { ListenersStorage } from './ListenersStorage';


export interface ListenersInterface<E extends HTMLElement> {
	click?: (element: E, event: MouseEvent) => void
	dblclick?: (element: E, event: MouseEvent) => void
	contextmenu?: (element: E, event: MouseEvent) => void
	mouseenter?: (element: E, event: MouseEvent) => void
	mouseleave?: (element: E, event: MouseEvent) => void


	focusin?: (element: E, event: FocusEvent) => void
	focusout?: (element: E, event: FocusEvent) => void


	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/transitioncancel_event
	transitionstart?: (element: E, event: TransitionEvent) => void
	transitionend?: (element: E, event: TransitionEvent) => void
	// transitioncancel?: (element: E, event: TransitionEvent) => void


	// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
	pointerout?: (element: E, event: PointerEvent) => void
	pointerover?: (element: E, event: PointerEvent) => void
	pointerenter?: (element: E, event: PointerEvent) => void
	pointerleave?: (element: E, event: PointerEvent) => void
	// pointercancel?: (element: E, event: PointerEvent) => void
	// pointermove?: (element: E, event: PointerEvent) => void
	// pointerdown?: (element: E, event: PointerEvent) => void
	// pointerup?: (element: E, event: PointerEvent) => void

	dragstart?: (element: E, event: DragEvent) => any
	dragend?: (element: E, event: DragEvent) => any
}

export interface LoadingResourceListeners<E extends HTMLElement> extends ListenersInterface<E> {
	load?: (element: E, event: Event) => void
	error?: (element: E, event: ErrorEvent) => void
}

export interface LoadingResourceModifiers {
	onLoad(value: () => void): this
	onError(value: (error: any) => void): this
}







export class Listeners<I extends ListenersInterface<any>> extends Map<keyof I, I[keyof I]> {

	protected isHasGesture?: true

	protected setHandler(element: HTMLElement, eventName: string, handler: (element: HTMLElement, event: Event) => void) {
		let o = {
			userHandler: handler,
			handleEvent(event: Event) {
				try { event.stopPropagation(); this.userHandler(event.currentTarget as HTMLElement, event) }
				catch (error) { console.error(error) }
			}
		}
		element.addEventListener(eventName as string, o);
		return o
	}
	protected setGesuteListners(element: HTMLElement, gesture: GestureListners): void {
		element.addEventListener('pointercancel', gesture.pointerup);
		element.addEventListener('pointerdown', gesture.pointerdown);
		element.addEventListener('pointermove', gesture.pointermove);
		element.addEventListener('pointerup', gesture.pointerup);
	}
	protected removeGestureListners(element: HTMLElement, gesture: GestureListners): void {
		element.removeEventListener('pointercancel', gesture.pointerup);
		element.removeEventListener('pointerdown', gesture.pointerdown);
		element.removeEventListener('pointermove', gesture.pointermove);
		element.removeEventListener('pointerup', gesture.pointerup);
	}







	public gesture(): void { this.isHasGesture = true }


	public destroy(element: HTMLElement) {
		let data = ListenersStorage.getData<I>(element);

		let gestureListners = data.gestureListners;
		if (gestureListners) this.removeGestureListners(element, gestureListners)

		let events = data.events;
		if (events) {
			events.forEach((handler, eventName) => { element.removeEventListener(eventName as keyof HTMLElementEventMap, handler) })
			events.clear()
		}
	}




	public render(element: HTMLElement, gesture?: GestureClass<any>): this {
		let data = ListenersStorage.getData<I>(element);
		let events = data.events;
		let gestureListners = data.gestureListners;


		if (this.isHasGesture) {
			if (!gesture) console.error('')
			else if (!gestureListners) {
				data.gestureListners = gestureListners = new GestureListners(gesture);
				this.setGesuteListners(element, gestureListners)
			} else gestureListners.context = gesture;
		}
		else if (gestureListners) {
			this.removeGestureListners(element, gestureListners)
			data.gestureListners = gestureListners = undefined;
		}



		if (!events) {
			events = data.events = new Map;
			this.forEach((handler, eventName) => {
				let object = this.setHandler(element, eventName as string, handler as unknown as (element: HTMLElement, event: Event) => void);
				events!.set(eventName, object as unknown as { userHandler: I[keyof I], handleEvent: (event: Event) => void })
			});
			return this
		}

		// remove unused listeners
		events.forEach((handler, eventName) => {
			if (!this.has(eventName)) {
				element.removeEventListener(eventName as keyof HTMLElementEventMap, handler);
				events!.delete(eventName);
			}
		})

		// add unregistered listeners
		this.forEach((handler, eventName) => {
			let targetHandler = events!.get(eventName);
			if (targetHandler) targetHandler.userHandler = handler
			else {
				let object = this.setHandler(element, eventName as string, handler as unknown as (element: HTMLElement, event: Event) => void)
				events!.set(eventName, object as unknown as { userHandler: I[keyof I], handleEvent: (event: Event) => void })
			}
		})

		return this
	}
}
export interface Listeners<I extends ListenersInterface<any>> {
	set<P extends keyof I>(key: P, value: NonNullable<I[P]>): this
	get<P extends keyof I>(key: P | string): I[P] | undefined
}