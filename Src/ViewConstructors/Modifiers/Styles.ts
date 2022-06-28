import type { MinimalStylesInterface } from '../../Styles/CSS/Types';






export class Styles<I extends MinimalStylesInterface> extends Map<keyof I, I[keyof I]> {



	public getCollectableStyles<P extends keyof I, C extends NonNullable<I[P]>, A extends any[]>(key: P, constructor: new (...p: A) => C, ...constructorParameters: A): C {
		let v = this.get(key);
		if (!v) this.set(key, v = new constructor(...constructorParameters))
		return v as C
	}

	public render(element: HTMLElement): this {
		const styles = element.style
		if (styles.length == 0) { this.forEach((value, key) => styles.setProperty(key as string, String(value))); return this }

		for (let i = 0; i < styles.length; i++) {
			let styleProperty = element.style.item(i);
			if (!this.has(styleProperty as any)) { styles.removeProperty(styleProperty); i-- }
		}
		this.forEach((value, key) => {
			let v = String(value);
			if (styles.getPropertyValue(key as any) != v) styles.setProperty(key as string, v)
		})
		return this
	}
}
export interface Styles<I extends MinimalStylesInterface> {
	get<P extends keyof I>(key: P): I[P] | undefined
	set<P extends keyof I>(key: P, value: NonNullable<I[P]>): this
}
