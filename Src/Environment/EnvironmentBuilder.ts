import { LightObserver } from '../Data/Observed';




let onLoadCallbacksStorage: (() => void)[] = [];

if (document.readyState != 'complete') window.addEventListener('load', () => {
	for (let item of onLoadCallbacksStorage) item();
	onLoadCallbacksStorage.length = 0;
}, { once: true })



type list<C extends EnvironmentBuilder> = Exclude<keyof C, keyof LightObserver | 'safeChangeValue' | 'resetPageEnvironments'>











export abstract class EnvironmentBuilder extends LightObserver {

	private pageEnvironments: Map<list<this>, () => void> = new Map





	private addElementToFind<T extends HTMLElement>(selectore: string, result: (element: T | null) => void): void {
		if (document.readyState == 'complete') result(document.querySelector<T>(selectore));
		else onLoadCallbacksStorage.push(() => result(document.querySelector<T>(selectore)));
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




	protected readonlyEnvironment<P extends keyof this>(property: P, value: this[P]): this {
		Object.defineProperty(this, property, {
			configurable: false,
			writable: false,
			value: value
		})
		return this
	}

	protected addPageEnvironment(property: list<this>, onReset: () => void): this {
		this.pageEnvironments.set(property, onReset);
		return this
	}

	protected removePageEnvironment(property: list<this>): this {
		this.pageEnvironments.delete(property);
		return this
	}








	public resetPageEnvironments(): void {
		this.pageEnvironments.forEach(value => value());
		this.environmentSnapshots = undefined;
	}

	public safeChangeValue<P extends list<this>>(property: P, value: this[P]): (() => void) | void {
		let oldValue = this[property];
		this[property] = value;
		// if (property == 'title' || property == 'allowPageTranslated') return;
		if (this.pageEnvironments.has(property) && !this.environmentSnapshots) return;
		return () => this[property] = oldValue;
	}


	public environmentSnapshots?: object
}
