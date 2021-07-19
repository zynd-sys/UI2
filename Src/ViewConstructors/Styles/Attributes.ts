

export interface ElementAttributeInterface {
	'tabindex'?: number
	'draggable'?: true
	'id'?: string
}


export class ElementAttribute<I extends ElementAttributeInterface> extends Map<keyof I, I[keyof I]> {

	// public replaceAttribute(attribute: ElementAttribute<I>): this { this.clear(); attribute.forEach((v, k) => this.set(k, v as NonNullable<I[keyof I]>)); return this }


	public destroy(element: HTMLElement): void {
		for (let key of element.attributes)
			if (key.name != 'class' && key.name != 'style' && key.name != 'slot')
				element.removeAttribute(key.name)
	}

	public render(element: HTMLElement): this {
		for (let key of element.attributes)
			if (key.name != 'class' && key.name != 'style' && key.name != 'slot' && !this.has(key.name as any))
				element.removeAttribute(key.name);


		this.forEach((value, key) => {
			if (element.getAttribute(key as string) != value as any) element.setAttribute(key as string, typeof value == 'boolean' ? '' : String(value))
		})

		return this
	}
}
export interface ElementAttribute<I extends ElementAttributeInterface> {
	set<P extends keyof I>(key: P, value: NonNullable<I[P]>): this
	get<P extends keyof I>(key: P | string): I[P] | undefined
}
