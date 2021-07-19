import { HTMLElementDataStorage } from "../../Data/Storages/HTMLElments";


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
	transitioncancel?: (element: E, event: TransitionEvent) => void


	// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
	pointerout?: (element: E, event: PointerEvent) => void
	pointerover?: (element: E, event: PointerEvent) => void
	pointerenter?: (element: E, event: PointerEvent) => void
	pointerleave?: (element: E, event: PointerEvent) => void

	dragstart?: (element: E, event: DragEvent) => any
	dragend?: (element: E, event: DragEvent) => any
}






export class Listeners<I extends ListenersInterface<any>> extends Map<keyof I, I[keyof I]> {

	public destroy(element: HTMLElement) {
		let data = HTMLElementDataStorage.getData<I>(element).events;
		if (!data) return

		data.forEach((handler, eventName) => { element.removeEventListener(eventName as keyof HTMLElementEventMap, handler) })
		data.clear()
	}


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






	public render(element: HTMLElement): this {
		let data = HTMLElementDataStorage.getData<I>(element);
		let events = data.events;

		if (!events) {
			events = data.events = new Map;
			this.forEach((handler, eventName) => {
				let object = this.setHandler(element, eventName as string, handler as unknown as (element: HTMLElement, event: Event) => void);
				events!.set(eventName, object as unknown as { userHandler: I[keyof I], handleEvent: (event: Event) => void })
			});
			return this
		}

		// remove unuser listeners
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