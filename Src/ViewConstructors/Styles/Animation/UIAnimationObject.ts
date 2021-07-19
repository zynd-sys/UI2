import { AnimationStorage } from "../../../Data/Storages/Animations"
import { AnimationResize } from "../../Enum/AnimationResize"
import { UIAnimation, UIAnimationClass } from "./UIAnimation"



const createAnimation: UIAnimationClass<AnimationResize.create> = UIAnimation(350, AnimationResize.create)
	.opacityEffect(0, 1)
	.scaleXEffect(0, 1)
	.scaleYEffect(0, 1)
const destroyedAnimation: UIAnimationClass<AnimationResize.destroy> = UIAnimation(350, AnimationResize.destroy)
	.opacityEffect(1, 0)
	.scaleXEffect(1, 0)
	.scaleYEffect(1, 0)




export class UIAnimationObject {
	public withChild?: boolean
	public created?: ((coordinates: () => DOMRect) => UIAnimationClass<AnimationResize.create>) = () => createAnimation
	public destroyed?: ((coordinates: () => DOMRect) => UIAnimationClass<AnimationResize.destroy>) = () => destroyedAnimation



	public animateCreation(element: HTMLElement): Promise<void> | void {
		if (!this.created) return

		let func = this.created;
		if (element.isConnected) return func(() => element.getBoundingClientRect()).animate(element)

		let promise = new Promise<void>(resolve =>
			window.requestAnimationFrame(() => resolve(func(() => element.getBoundingClientRect()).animate(element, false)))
		)
		AnimationStorage.addAnimation(element, promise);
		return promise

	}
	public animateDestruction(element: HTMLElement): Promise<void> | void {
		if (!this.destroyed) return
		return this.destroyed(() => element.getBoundingClientRect()).animate(element)
	}
}