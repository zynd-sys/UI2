import { GestureActionType, GestureClass } from "./Gesture";
import { ui2Event } from "./ui2Event";



// interface GestureListners {
// 	pointers: number
// 	context: GestureClass<any>
// 	pointerdown: (element: HTMLElement, event: PointerEvent) => void;
// 	pointerup: (element: HTMLElement, event: PointerEvent) => void;
// 	pointermove: (element: HTMLElement, event: PointerEvent) => void;
// }




export class GestureListners {
	protected pointers: number = 0
	public context: GestureClass<any>
	public pointerdown = (event: PointerEvent) => {
		(event!.target as HTMLElement).setPointerCapture(event.pointerId);
		this.pointers++;
		this.context.update(GestureActionType.down, new ui2Event(event))
	}
	public pointerup = (event: PointerEvent) => {
		(event!.target as HTMLElement).releasePointerCapture(event.pointerId);
		this.pointers--;
		this.context.update(GestureActionType.up, new ui2Event(event));
	}
	public pointermove = (event: PointerEvent) => {
		if (this.pointers == 0) return
		this.context.update(GestureActionType.move, new ui2Event(event))
	}

	constructor(context: GestureClass<any>) { this.context = context; }
}

// let element = document.createElement('div');
// const t = new class test {
// 	down = event => console.log(event,this)
// }
// $0.addEventListener('pointerdown',t.down);