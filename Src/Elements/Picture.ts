import type { ImageMimeType } from "Enum/ImageMimeType"
import type { Listeners, ListenersInterface, LoadingResourceModifiers } from "ViewConstructors/Modifiers/Listeners/Listeners"
import type { StylesInterface } from "CSS/Types/StylesInterface"
import type { Crossorigin } from "Enum/Crossorigin"
import type { ReferrerPolicyOptions } from "Enum/ReferrerPolicyOptions"
import { Color, DefaultColor } from "Colors"
import { SecurityPolicyAttribute, SecurityPolicyViewModifiers, ElementAttribute } from "ViewConstructors/Modifiers/Attributes"
import { MediaFit } from "Enum/MediaFit"
import { FitPositionStyle } from "ViewConstructors/Modifiers/CollectableStyles/FitPosition"
import { Styles } from "CSS/Styles"
import { MainStyleSheet } from "CSS/MainStyleSheet"
import { CSSSelectore } from "CSS/CSSSelectore"
import { MediaStyleInterface, ViewMediaElement } from "ViewConstructors/ViewMediaElement"







interface PictureStyleInterface extends MediaStyleInterface {
	'--overlay-color'?: Color | string
	'--object-fit'?: MediaFit
	'--object-position'?: FitPositionStyle
}


// @ts-ignore
interface PictureSelectoreStyle extends StylesInterface {
	'object-fit': 'var(--object-fit)',
	'object-position': 'var(--object-position)'
}

interface ImageAttribute extends SecurityPolicyAttribute {
	'loading'?: 'lazy' | 'eager'
	'decoding'?: 'async' | 'auto'
	'src'?: string | URL
	'alt'?: string
}







MainStyleSheet.add(
	new CSSSelectore('picture', {
		'display': 'block',
		'overflow': 'hidden',
		'user-select': 'none',
		'-webkit-user-select': 'none',
		'max-inline-size': '100%',
		'inline-size': '100%',
		/* max-block-size: 100%;
		block-size: 100%; */
		'position': 'relative'
	}),
	new CSSSelectore('picture::after, picture img', {
		'display': 'block',
		'position': 'absolute',
		'inset': 0,
		'block-size': '100%',
		'max-inline-size': '100%',
		'inline-size': '100%'
	}),
	new CSSSelectore<PictureStyleInterface>('picture', {
		'--object-fit': MediaFit.cover,
		'--object-position': new FitPositionStyle('50%', '50%'),
		'--overlay-color': DefaultColor.transparent
	}),
	// @ts-ignore
	new CSSSelectore<PictureSelectoreStyle>('picture img', {
		'object-fit': 'var(--object-fit)',
		'object-position': 'var(--object-position)'
	}),

	new CSSSelectore('picture::after', {
		'content': '""',
		'background': 'var(--overlay-color)'
	})
)















export class PictureView extends ViewMediaElement<{ parent: HTMLPictureElement, image: HTMLImageElement }, ImageMimeType> implements SecurityPolicyViewModifiers, LoadingResourceModifiers {

	protected HTMLElement?: { parent: HTMLPictureElement, image: HTMLImageElement }

	protected styles: Styles<PictureStyleInterface> = new Styles
	protected listeners?: Listeners<ListenersInterface<HTMLPictureElement>>
	protected attribute?: ElementAttribute<SecurityPolicyAttribute>

	protected content: ElementAttribute<ImageAttribute> = new ElementAttribute<ImageAttribute>()
		.set('loading', 'lazy')
		.set('decoding', 'async')

	protected useCSSVariablesForMediaStyles: boolean = true
	protected useSrcsetSource: boolean = true
	protected loadUserHandler?: (naturalHeight: number, naturalWidth: number) => void
	protected errorUserHandler?: (error: any) => void








	/**
	 * import: styles, listeners, content, description, stylesImage, sourceArray
	 */
	protected override importProperty(view: PictureView): ReturnType<ViewMediaElement<any, any>['importProperty']> {
		super.importProperty(view);
		this.errorUserHandler = view.errorUserHandler;
		this.loadUserHandler = view.loadUserHandler;
	}
	protected generateHTMLElement(): { parent: HTMLPictureElement, image: HTMLImageElement } {
		if (this.HTMLElement) return this.HTMLElement
		let pictureElement = document.createElement('picture');
		let imageElement = pictureElement.appendChild(document.createElement('img'));
		this.content.render(imageElement);

		imageElement.addEventListener('load', () => this.loadUserHandler?.(imageElement.naturalHeight, imageElement.naturalWidth), { passive: true })
		imageElement.addEventListener('error', event => this.errorUserHandler?.(event), { passive: true })

		return { parent: pictureElement, image: imageElement }
	}
	protected merge(newRender: PictureView, element: { parent: HTMLPictureElement, image: HTMLImageElement }): void {
		this.content = newRender.content;
		this.content.render(element.image)
	}








	public override destroy(withAnimation?: boolean): Promise<void> | void {
		let result = super.destroy(withAnimation);
		if (result) return result.then(() => {
			this.sourceList?.destroy();
			this.sourceList = undefined;
		})
		this.sourceList?.destroy();
		this.sourceList = undefined;
	}





	// float
	// shape-outside
	public referrerPolicy(value: ReferrerPolicyOptions): this { this.content.set('referrerpolicy', value); return this }
	public crossorigin(value: Crossorigin): this { this.content.set('crossorigin', value); return this }
	public overlayColor(value: string): this { this.styles.set('--overlay-color', value); return this }
	/** @param value default `true` */
	public noLazyLoading(value: boolean = true): this { if (value) this.content.set('loading', 'eager'); return this }
	public noAsyncDecoding(value: boolean = true): this { if (value) this.content.set('decoding', 'auto'); return this }

	public onLoad(value: (naturalHeight: number, naturalWidth: number) => void): this { this.loadUserHandler = value; return this }
	public onError(value: (error: any) => void): this { this.errorUserHandler = value; return this }


	constructor(src: string | URL, description: string) {
		super();
		this.content
			.set('src', src)
			.set('alt', description);
	}
}

export function Picture(src: string | URL, description: string): PictureView { return new PictureView(src, description) }