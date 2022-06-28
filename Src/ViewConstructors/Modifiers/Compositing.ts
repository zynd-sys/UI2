import { AnimationStorage, UIAnimationClass } from './Animation/UIAnimation'
import { App } from '../../Navigation/App'
import { Units } from '../../Styles/CSS/Enums/Units'


export interface CompositingCoords {
	top: number
	left: number
	width: number
	height: number
}








class CompositingClass {

	protected defaultAnimation: UIAnimationClass = new UIAnimationClass(600)
	protected rendering: boolean = false
	protected callingAnimationFrame: boolean = false
	protected renderingActions: [Set<() => void>, Set<() => void>] = [new Set, new Set]


	public requestAnimationFrame(priorety: 0 | 1, callback: () => void): void {
		this.renderingActions[priorety].add(callback)

		if (this.callingAnimationFrame == false) {
			window.requestAnimationFrame(() => {
				for (let frame of this.renderingActions) {
					for (let item of frame)
						try { item() }
						catch (error) { console.error(error) }
					frame.clear();
				}
				this.callingAnimationFrame = false;
			})
			this.callingAnimationFrame = true
		}
	}




	public render(customAnimation?: UIAnimationClass): void {
		if (this.rendering) return

		let elements: Map<HTMLElement, CompositingCoords> = new Map
		App.getRectElements(elements)


		this.requestAnimationFrame(1, () => {
			const animation = customAnimation || this.defaultAnimation;

			UIAnimationClass.globalAnimationOptions = animation.animationOptions;
			AnimationStorage.addAnimationCompletionHandler(this, () => UIAnimationClass.globalAnimationOptions = undefined)

			elements.forEach((oldCoord, element) => {
				if (!element.isConnected || element.getAnimations().length) return
				let newCoord = element.getBoundingClientRect();

				if (oldCoord.top != newCoord.top || oldCoord.left != newCoord.left) animation
					.translateXEffect(Units.px, oldCoord.left + oldCoord.width / 2 - newCoord.left - newCoord.width / 2, 0)
					.translateYEffect(Units.px, oldCoord.top + oldCoord.height / 2 - newCoord.top - newCoord.height / 2, 0)
					.animate(element)
			})

			this.rendering = false;
		})
	}


	public isRendering(): boolean { return this.rendering }

}

export const Compositing = new CompositingClass;

export function withAnimation(animation?: UIAnimationClass): void { Compositing.render(animation); }
