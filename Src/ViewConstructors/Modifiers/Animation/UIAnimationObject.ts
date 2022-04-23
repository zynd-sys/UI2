import { PageData } from 'Data/PageData/PageData'
import { Compositing } from '../Compositing'
import { AnimationStorage, UIAnimation, UIAnimationClass } from './UIAnimation'



const createAnimation: UIAnimationClass = UIAnimation(350)
	.opacityEffect(0, 1)
	.scaleXEffect(0, 1)
	.scaleYEffect(0, 1)
const destroyedAnimation: UIAnimationClass = UIAnimation(350)
	.opacityEffect(1, 0)
	.scaleXEffect(1, 0)
	.scaleYEffect(1, 0)




export class UIAnimationObject {
	public withChild?: boolean
	public created?: ((coordinates: () => DOMRect) => UIAnimationClass) = () => createAnimation
	public destroyed?: ((coordinates: () => DOMRect) => UIAnimationClass) = () => destroyedAnimation



	public animateCreation(element: HTMLElement): Promise<void> | void {
		if (!this.created || PageData.reducedAnimation) return

		let func = this.created;
		if (element.isConnected) return func(() => element.getBoundingClientRect()).animate(element)

		let promise = new Promise<void>(resolve =>
			Compositing.requestAnimationFrame(1, () => resolve(func(() => element.getBoundingClientRect()).animate(element, false)))
		)
		AnimationStorage.addAnimation(element, promise);
		return promise

	}

	public animateDestruction(element: HTMLElement): Promise<void> | void {
		if (!this.destroyed || PageData.reducedAnimation) return
		return this.destroyed(() => element.getBoundingClientRect()).animate(element)
	}
}