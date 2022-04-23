import type { ButtonActionInterface } from "../Button";
import { Units } from "Enum/Units";
import { Picture } from "../Picture";




class ShareClass implements ButtonActionInterface {

	protected data: ShareData = {}

	public onClick(): void {
		window.navigator.share(this.data).catch(error => console.error(error))
	}
	public elements() {
		return [
			Picture('data:image/svg+xml,<svg height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/></svg>', '')
				.height(.75, Units.rem).width(.75, Units.rem)
		]
	}

	public title(value: string): this { this.data.title = value; return this }
	public files(value: File[]): this { this.data.files = value; return this }
	public text(value: string): this { this.data.text = value; return this }
	public url(value: string | URL): this { this.data.url = value.toString(); return this }


	constructor(title: string, text?: string, files?: File[], url?: string | URL) {
		this.data.title = title;
		this.data.files = files;
		this.data.text = text;
		this.data.url = url?.toString();
	}


}


export const Share: typeof ShareClass | undefined = (window.navigator.share) ? ShareClass : undefined