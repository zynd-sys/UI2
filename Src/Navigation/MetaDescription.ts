import type { ImageMimeType } from '../ViewConstructors/Enum/ImageMimeType';
import type { Color } from '../ViewConstructors/Modifiers/Colors';



export abstract class MetaDescriptionInterface {
	public abstract title: string;
	public abstract keywords: string | string[];
	public abstract description: string;
	public abstract JsonLD: string | object | object[];
	public abstract lang: string;
	public abstract themeColor?: Color;
	// public abstract OPImg: { src: string, }

	public abstract pageIcon: { mimeType: ImageMimeType, size?: string, src: string }

}







export class MetaDescriptionClass {
	protected storage: Map<new () => MetaDescriptionInterface, (url: string) => boolean> = new Map()

	protected descriptionElement: HTMLMetaElement | { content: string } = { content: '' }
	protected keywordsElement: HTMLMetaElement | { content: string } = { content: '' };
	protected themeColorElement: HTMLMetaElement | { content: string } = { content: '' };
	protected jsonLDElement: HTMLScriptElement | { textContent: string } = { textContent: '' }
	protected iconElement: HTMLLinkElement | { href: string, type?: ImageMimeType } = { href: '' }


	protected getMetaDescription(url: string): (new () => MetaDescriptionInterface) | undefined { for (let element of this.storage) if (element[1](url)) return element[0] }



	public update(url: string = window.location.pathname): void {
		let data = this.getMetaDescription(url);
		if (!data) { console.info('MetaDescription: not found MetaDescriptionClass for url: ' + url); return }
		const value = new data();
		document.title = value.title;
		this.descriptionElement.content = value.description;
		this.keywordsElement.content = Array.isArray(value.keywords) ? value.keywords.join(',') : value.keywords;
		this.jsonLDElement.textContent = typeof value.JsonLD == 'object' ? JSON.stringify(value.JsonLD) : value.JsonLD;
		document.documentElement.lang = value.lang;
		this.iconElement.href = value.pageIcon.src;
		this.iconElement.type = value.pageIcon.mimeType;
		if (value.themeColor) this.themeColorElement.content = value.themeColor.toString();
		// if (value.openGraph) this.openGraph.setToPage();
	}



	public addMetaDescription(check: (url: string) => boolean): <D extends new (...p: any[]) => MetaDescriptionInterface>(value: D) => D { return value => { this.storage.set(value, check); return value } }




	protected getHTMLMetaElement(name: string, value: string): HTMLMetaElement {
		let MetaElement = document.querySelector<HTMLMetaElement>(`meta[name='${name}']`);
		if (MetaElement) return MetaElement;

		let e = document.createElement('meta');
		e.name = name;
		e.content = value;
		document.head.appendChild(e);
		return e;
	}
	protected init() {
		this.descriptionElement = this.getHTMLMetaElement('description', this.descriptionElement.content)
		this.keywordsElement = this.getHTMLMetaElement('keywords', this.keywordsElement.content)
		this.themeColorElement = this.getHTMLMetaElement('theme-color', this.themeColorElement.content)

		let scriptJSONLD = document.querySelector(`script[type='application/ld+json']`) as HTMLScriptElement | null;
		if (!scriptJSONLD) {
			scriptJSONLD = document.createElement('script');
			scriptJSONLD.type = 'application/ld+json';
			document.head.appendChild(scriptJSONLD);
		}
		scriptJSONLD.textContent = this.jsonLDElement.textContent;
		this.jsonLDElement = scriptJSONLD;

		let linkIcon = document.querySelector(`link[rel='icon']`) as HTMLLinkElement | null;
		if (!linkIcon) {
			linkIcon = document.createElement('link');
			linkIcon.rel = 'icon';
			document.head.appendChild(linkIcon);
		}
		linkIcon.href = this.iconElement.href;
		if (this.iconElement.type) linkIcon.type = this.iconElement.type;
		// linkIcon.sizes.add() = this.iconElement.sizes;
		this.iconElement = linkIcon;
	}
	constructor() {
		if (document.readyState != 'complete') window.addEventListener('load', () => this.init(), { once: true })
		else this.init()
	}
}

export const MetaDescription: MetaDescriptionClass = new MetaDescriptionClass();