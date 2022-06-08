import type { ImageMimeType } from '../ViewConstructors/Enum/ImageMimeType';
import type { Color } from '../Styles/Colors';
import * as Observed from '../Data/Observed';
import { EnvironmentBuilder } from './EnvironmentBuilder';



export class PageIcon {
	protected getElement: () => HTMLLinkElement | { sizes: { value: string }, href: string, type?: ImageMimeType }

	protected mimeTypeValue?: ImageMimeType
	public get mimeType(): ImageMimeType | undefined { return this.mimeTypeValue }
	public set mimeType(value) { this.mimeTypeValue = value; this.getElement().type = value }

	protected srcValue: string | URL = ''
	public get src(): string | URL { return this.srcValue }
	public set src(value) { this.srcValue = value; this.getElement().href = value.toString() }

	protected sizeValue: string = ''
	public get size(): string { return this.sizeValue }
	public set size(value) { this.sizeValue = value; this.getElement().sizes.value = value }

	constructor(getElement: () => HTMLLinkElement | { sizes: { value: string }, href: string, type?: ImageMimeType }) {
		this.getElement = getElement
	}
}







export class EnvironmentMetaDescription extends EnvironmentBuilder {

	public get title(): string { return document.title }
	public set title(value: string) { document.title = value }


	public get lang(): string { return document.documentElement.lang }
	public set lang(value: string) { document.documentElement.lang = value }


	public get direction(): 'rtl' | 'ltr' { return document.documentElement.dir == 'rtl' ? 'rtl' : 'ltr' }
	public set direction(value: 'rtl' | 'ltr') { document.documentElement.dir = value }


	private descriptionElement: HTMLMetaElement | { content: string } = { content: '' }
	public get description(): string { return this.descriptionElement.content }
	public set description(value: string) { this.descriptionElement.content = value }



	private themeColorValue?: Color
	private themeColorElement: HTMLMetaElement | { content: string } = { content: '' };
	public get themeColor(): Color | undefined { return this.themeColorValue }
	public set themeColor(value: Color | undefined) { this.themeColorValue = value; this.themeColorElement.content = value ? value.toString() : ''; }




	private keywordsElement: HTMLMetaElement | { content: string } = { content: '' };
	public readonly keywords: Observed.Arrays<string> = new Observed.Arrays


	private jsonLDElement: HTMLScriptElement | { textContent: string } = { textContent: '' }
	public readonly JsonLD: Observed.Arrays<any> = new Observed.Arrays;


	// public abstract OPImg: { src: string, }
	private iconElement: HTMLLinkElement | { sizes: { value: string }, href: string, type?: ImageMimeType } = { href: '', sizes: { value: '' } }
	public pageIcon = new PageIcon(() => this.iconElement)






	constructor() {
		super();
		this
			.findOrCreateElement('meta', 'name', 'description', element => {
				element.content = this.descriptionElement.content;
				this.descriptionElement = element;
			})
			.findOrCreateElement('meta', 'name', 'keywords', element => {
				element.content = this.keywordsElement.content;
				this.keywordsElement = element;
			})
			.findOrCreateElement('meta', 'name', 'theme-color', element => {
				element.content = this.themeColorElement.content;
				this.themeColorElement = element;
			})
			.findOrCreateElement('script', 'type', 'application/ld+json', element => {
				element.textContent = this.jsonLDElement.textContent;
				this.jsonLDElement = element;
			})
			.findOrCreateElement('link', 'rel', 'icon', element => {
				element.href = this.iconElement.href;
				element.type = this.iconElement.type || '';
				element.sizes.value = this.iconElement.sizes.value;
				this.iconElement = element;
			});
	}


}

