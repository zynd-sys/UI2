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

	/**  @pageEnvironment */
	public get title(): string { return document.title }
	public set title(value: string) { document.title = value }


	/**  @pageEnvironment */
	public get lang(): string { return document.documentElement.lang }
	public set lang(value: string) { document.documentElement.lang = value }

	/**  @pageEnvironment */
	public get allowPageTranslated(): boolean { return document.documentElement.translate }
	public set allowPageTranslated(value: boolean) { document.documentElement.translate = value }

	/**  @pageEnvironment */
	public get direction(): 'rtl' | 'ltr' { return document.documentElement.dir == 'rtl' ? 'rtl' : 'ltr' }
	public set direction(value: 'rtl' | 'ltr') { document.documentElement.dir = value }



	/**  @pageEnvironment */
	private descriptionElement: HTMLMetaElement | { content: string } = { content: '' }
	public get description(): string { return this.descriptionElement.content }
	public set description(value: string) { this.descriptionElement.content = value }



	/**  @pageEnvironment */
	private themeColorValue?: Color
	private themeColorElement: HTMLMetaElement | { content: string } = { content: '' };
	public get themeColor(): Color | undefined { return this.themeColorValue }
	public set themeColor(value: Color | undefined) { this.themeColorValue = value; this.themeColorElement.content = value ? value.toString() : ''; }




	/**  @pageEnvironment */
	private keywordsElement: HTMLMetaElement | { content: string } = { content: '' };
	public readonly keywords!: Observed.Arrays<string>


	/**  @pageEnvironment */
	private jsonLDElement: HTMLScriptElement | { textContent: string } = { textContent: '' }
	public readonly jsonLd!: Observed.Arrays<any>


	// public abstract OPImg: { src: string, }
	private iconElement: HTMLLinkElement | { sizes: { value: string }, href: string, type?: ImageMimeType } = { href: '', sizes: { value: '' } }
	public readonly pageIcon!: PageIcon






	constructor() {
		super();
		const keywords: Observed.Arrays<string> = new Observed.Arrays;
		keywords.addBeacon(() => this.keywordsElement.content = this.keywords.join(','));

		const JsonLD: Observed.Arrays<any> = new Observed.Arrays;
		JsonLD.addBeacon(() => this.jsonLDElement.textContent = this.keywords.join(','));

		const pageIcon = new PageIcon(() => this.iconElement)


		this
			.readonlyEnvironment('pageIcon', pageIcon)
			.readonlyEnvironment('keywords', keywords)
			.readonlyEnvironment('jsonLd', JsonLD)
		this
			.addPageEnvironment('title' as any, () => this.title = '')
			.addPageEnvironment('lang' as any, () => this.lang = '')
			.addPageEnvironment('allowPageTranslated' as any, () => this.allowPageTranslated = false)
			.addPageEnvironment('direction' as any, () => this.direction = 'rtl')
			.addPageEnvironment('description' as any, () => this.description = '')
			.addPageEnvironment('themeColor' as any, () => this.themeColor = undefined)
			.addPageEnvironment('keywords' as any, () => this.keywords.length = 0)
			.addPageEnvironment('jsonLd' as any, () => this.jsonLd.length = 0)
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

