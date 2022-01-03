


class AnimationStorageClass {
	protected storage: Set<Element> = new Set;
	protected completionStorage: Map<object, () => void> = new Map;

	protected mainHandler(element: Element) {
		this.storage.delete(element);

		if (this.storage.size == 0) {
			this.completionStorage.forEach(v => v());
			this.completionStorage.clear()
		}
	}




	public addAnimation(element: Element, promise: Promise<void>): void {
		if (!this.storage.has(element)) this.storage.add(element);
		else return console.error('replace animation', element);

		promise.then(() => this.mainHandler(element))
	}
	public addAnimationCompletionHandler(object: object): Promise<void>
	public addAnimationCompletionHandler(object: object, handler: () => void): void
	public addAnimationCompletionHandler(object: object, handler?: () => void): void | Promise<void> {
		if (this.storage.size == 0) return handler ? handler() : Promise.resolve();

		if (handler) this.completionStorage.set(object, handler)
		else new Promise<void>(resolve => this.completionStorage.set(object, () => this.completionStorage.set(object, resolve)))
	}


	public checkOutAnimation(element: Element): boolean { return this.storage.has(element) }
	public get isAnimated(): boolean { return this.storage.size != 0 }
}


export const AnimationStorage = new AnimationStorageClass;