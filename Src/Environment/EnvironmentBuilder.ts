import { LightObserver } from "../Data/Observed";




export abstract class EnvironmentBuilder extends LightObserver {
	private onLoadCallbacksStorage: (() => void)[] = []



	private addElementToFind<T extends HTMLElement>(selectore: string, result: (element: T | null) => void): void {
		if (document.readyState == 'complete') result(document.querySelector<T>(selectore));
		else this.onLoadCallbacksStorage.push(() => result(document.querySelector<T>(selectore)));
	}


	protected findOrCreateElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute: keyof HTMLElementTagNameMap[T], attributeValue: string, result: (element: HTMLElementTagNameMap[T]) => void): this {
		this.addElementToFind<HTMLElementTagNameMap[T]>(`${tag}[${attribute.toString()}='${attributeValue}']`, element => {
			if (element) { result(element); return }

			let e = document.head.appendChild(document.createElement(tag));
			e.setAttribute(attribute as string, attributeValue);
			result(e);
		})

		return this
	}



	public safeChangeValue<P extends keyof this>(property: P, value: this[P]): () => void {
		let currentValue = this[property];
		this[property] = value;
		return () => this[property] = currentValue;
	}



	constructor() {
		super();
		if (document.readyState != 'complete') window.addEventListener('load', () => {
			for (let item of this.onLoadCallbacksStorage) item();
			this.onLoadCallbacksStorage.length = 0;
		}, { once: true })
	}
}