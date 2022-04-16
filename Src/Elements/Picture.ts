import type { ImageMimeType } from "../ViewConstructors/Enum/ImageMimeType"
import type { SecurityPolicyAttribute, SecurityPolicyViewModifiers, ElementAttribute } from "../ViewConstructors/Modifiers/Attributes"
import type { Listeners, ListenersInterface } from "../ViewConstructors/Modifiers/Listeners/Listeners"
import type { StylesInterface } from "../ViewConstructors/Modifiers/CSS/Types/StylesInterface"
import type { Color } from "../ViewConstructors/Modifiers/Colors"
import type { Crossorigin } from "../ViewConstructors/Enum/Crossorigin"
import type { ReferrerPolicyOptions } from "../ViewConstructors/Enum/ReferrerPolicyOptions"
import { MediaFit } from "../ViewConstructors/Enum/MediaFit"
import { FitPositionStyle } from "../ViewConstructors/Modifiers/CollectableStyles/FitPosition"
import { Styles } from "../ViewConstructors/Modifiers/CSS/Styles"
import { MainStyleSheet } from "../ViewConstructors/Modifiers/CSS/MainStyleSheet"
import { CSSSelectore } from "../ViewConstructors/Modifiers/CSS/CSSSelectore"
import { DefaultColor } from "../ViewConstructors/Modifiers/Colors/DefaultColors"
import { MediaStyleInterface, ViewMediaElement } from "../ViewConstructors/ViewMediaElement"







export interface PictureStyleInterface extends MediaStyleInterface {
	'--overlay-color'?: Color
	'--object-fit'?: MediaFit
	'--object-position'?: FitPositionStyle
}


// @ts-ignore
interface PictureSelectoreStyle extends StylesInterface {
	'object-fit': 'var(--object-fit)',
	'object-position': 'var(--object-position)'
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

	protected content: string | URL

	protected useCSSVariablesForMediaStyles: boolean = true
	protected description: string
	protected referrerPolicyValue?: ReferrerPolicyOptions
	protected crossoriginValue?: Crossorigin
	protected loadUserHandler?: (naturalHeight: number, naturalWidth: number) => void
	protected errorUserHandler?: (error: any) => void








	/**
	 * import: styles, listeners, content, description, stylesImage, sourceArray
	 */
	protected override importProperty(view: PictureView): ReturnType<ViewMediaElement<any, any>['importProperty']> {
		super.importProperty(view);
		this.description = view.description;
		this.sourceList = view.sourceList;
		this.referrerPolicyValue = view.referrerPolicyValue;
		this.crossoriginValue = view.crossoriginValue;
	}
	protected generateHTMLElement(): { parent: HTMLPictureElement, image: HTMLImageElement } {
		if (this.HTMLElement) return this.HTMLElement
		let pictureElement = document.createElement('picture');
		let imageElement = pictureElement.appendChild(document.createElement('img'));
		imageElement.alt = this.description;
		imageElement.src = this.content.toString();
		imageElement.loading = 'lazy';
		imageElement.decoding = 'async';
		imageElement.addEventListener('load', () => this.loadUserHandler?.(imageElement.naturalHeight, imageElement.naturalWidth), { passive: true })
		imageElement.addEventListener('error', event => this.errorUserHandler?.(event), { passive: true })

		if (this.referrerPolicyValue) imageElement.referrerPolicy = this.referrerPolicyValue;
		if (this.crossoriginValue) imageElement.crossOrigin = this.crossoriginValue;
		if (this.sourceList) this.sourceList.render(pictureElement);

		return { parent: pictureElement, image: imageElement }
	}
	protected merge(newRender: PictureView, element: { parent: HTMLPictureElement, image: HTMLImageElement }): void {
		if (this.description != newRender.description) { this.description = newRender.description; element.image.alt = this.description; }
		if (this.content != newRender.content) { this.content = newRender.content; element.image.src = this.content.toString(); }

		if (newRender.referrerPolicyValue && element.image.referrerPolicy != newRender.referrerPolicyValue) {
			element.image.referrerPolicy = this.referrerPolicyValue = newRender.referrerPolicyValue;
		} else if (element.image.referrerPolicy) {
			this.referrerPolicyValue = undefined;
			element.image.referrerPolicy = ''
		}
		if (newRender.crossoriginValue && element.image.crossOrigin != newRender.crossoriginValue) {
			element.image.crossOrigin = this.crossoriginValue = newRender.crossoriginValue;
		} else if (element.image.crossOrigin) {
			this.crossoriginValue = undefined;
			element.image.crossOrigin = null;
		}
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
	public referrerPolicy(value: ReferrerPolicyOptions): this { this.referrerPolicyValue = value; return this }
	public crossorigin(value: Crossorigin): this { this.safeAttribute.set('crossorigin', value); return this }
	public overlayColor(value: string): this { this.styles.set('--overlay-color', value as unknown as Color); return this }



	public onLoad(value: (naturalHeight: number, naturalWidth: number) => void): this { this.loadUserHandler = value; return this }
	public onError(value: (error: any) => void): this { this.errorUserHandler = value; return this }


	constructor(src: string | URL, description: string) {
		super();
		this.content = src;
		this.description = description;
	}
}

export function Picture(src: string | URL, description: string): PictureView { return new PictureView(src, description) }