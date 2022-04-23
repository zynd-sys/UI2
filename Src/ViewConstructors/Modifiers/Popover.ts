import type { View } from 'Elements/View'
import { App } from 'Navigation/App';



export class PopoverData {
	public view: new (...p: any[]) => View
	public data?: any[]


	public render(): this { if (this.view && this.data) App.core.setPopover(this.view.bind(this.view, ...this.data)); return this }
	public destroy(): this { App.core.disablePopover(); return this }

	constructor(view: new (...p: any[]) => View, data?: any[]) { this.view = view; this.data = data }
}