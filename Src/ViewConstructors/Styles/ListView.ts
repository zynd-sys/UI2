import type { ViewBuilder } from "../ViewBuilder";




export class ViewsList {

	protected data: (ViewBuilder | undefined)[] = []


	public get(i: number): ViewBuilder | undefined { return this.data[i] }
	public length(): number { return this.data.length }
	public push(value: ViewBuilder | undefined): this { this.data.push(value); return this }
	public unshift(value: ViewBuilder | undefined): this { this.data.unshift(value); return this }
	public clear(): this { this.data.length = 0; return this }
	public replace(value: (ViewBuilder | undefined)[]): this {
		this.data.length = 0;
		for (let v of value) this.data.push(v);
		return this
	}
	public forEach(callbackfn: (value: ViewBuilder | undefined, index: number) => void): this {
		for (let i = 0; i < this.data.length; i++) callbackfn(this.data[i], i);
		return this
	}
	public map<R>(callbackfn: (value: ViewBuilder | undefined, index: number) => R): R[] {
		let array: R[] = [];
		for (let i = 0; i < this.data.length; i++) array.push(callbackfn(this.data[i], i));
		return array
	}
	public splice(start: number, deleteCount: number = 0, ...values: (ViewBuilder | undefined)[]): this {
		this.data.splice(start, deleteCount, ...values);
		return this
	}






	public generateElements(contentNew?: ViewsList, animation?: boolean): (HTMLElement | Promise<void>)[] {
		let HTMLElementList: (HTMLElement | Promise<void>)[] = [];

		if (!contentNew) {
			this.forEach(view => { if (view) HTMLElementList.push(view.render(undefined, animation)) });
			return HTMLElementList
		}


		for (let i = 0; i < contentNew.data.length; i++) {
			let itemNew: ViewBuilder | undefined = contentNew.data[i];
			let itemNow: ViewBuilder | undefined = this.data[i];

			// not new item  (delete old view)
			if (!itemNew) {
				let result = itemNow?.destroy(animation);
				if (result instanceof Promise) HTMLElementList.push(result);
				this.data[i] = undefined;
				continue
			}

			// not now item  (create new view)
			if (!itemNow) {
				this.data[i] = itemNew;
				HTMLElementList.push(itemNew.render(undefined, animation));
				continue
			}

			if (itemNow.constructor != itemNew.constructor) {
				this.data[i] = itemNew;
				let result = itemNow.destroy(animation);
				if (result instanceof Promise) HTMLElementList.push(result)
				itemNow = itemNew;
				itemNew = undefined;
			}
			HTMLElementList.push(itemNow.render(itemNew));
		}

		if (this.data.length > contentNew.data.length) {
			for (let i = contentNew.data.length; i < this.data.length; i++) {
				let result = this.data[i]?.destroy(animation);
				if (result instanceof Promise) HTMLElementList.push(result)
			};
			this.data.length = contentNew.data.length;
		}
		return HTMLElementList
	}





	public render(parent: HTMLElement, animation: boolean = false, newListView?: ViewsList, beforeElements?: HTMLElement[]): void {

		let content = this.generateElements(newListView, animation);
		if (beforeElements) content.unshift(...beforeElements)


		if (parent.children.length == 0) {
			for (let i = 0; i < content.length; i++) {
				let element = content[i];
				if (element instanceof Promise) continue
				parent.appendChild(element)
			}
			return
		};


		for (let i = 0; i < content.length; i++) {
			let elementNow = parent.children.item(i);
			let elementNew = content[i];

			if (elementNew instanceof Promise || elementNew == elementNow) continue;
			if (!elementNow) { parent.appendChild(elementNew); continue }
			elementNow.replaceWith(elementNew);
		}
		if (content.length < parent.children.length)
			for (let i = content.length; i < parent.children.length; i++)
				parent.children.item(i)?.remove()
	}


	constructor(value: (ViewBuilder | undefined)[]) { for (let v of value) this.data.push(v); }
}