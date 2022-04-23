import type { SecurityPolicyAttribute, SecurityPolicyViewModifiers, ElementAttribute } from 'ViewConstructors/Modifiers/Attributes';
import type { Listeners, LoadingResourceListeners, LoadingResourceModifiers } from 'ViewConstructors/Modifiers/Listeners/Listeners';
import type { Crossorigin } from 'Enum/Crossorigin';
import type { ReferrerPolicyOptions } from 'Enum/ReferrerPolicyOptions';
import type { ViewModifiers } from 'ViewConstructors/ViewModifiers';
import { MediaFit } from 'Enum/MediaFit';
import { Styles } from 'CSS/Styles';
import { MainStyleSheet } from 'CSS/MainStyleSheet';
import { CSSSelectore } from 'CSS/CSSSelectore';
import { ViewMediaElement, MediaStyleInterface } from 'ViewConstructors/ViewMediaElement';















MainStyleSheet.add(
	new CSSSelectore('video.background-video', {
		'display': 'block',
		'overflow': 'hidden',
		'user-select': 'none',
		'-webkit-user-select': 'none',
		'max-inline-size': '100%',
		'inline-size': '100%',
		'object-fit': MediaFit.cover
	})
)






export class BackgroundVideoView extends ViewMediaElement<HTMLVideoElement, string> implements SecurityPolicyViewModifiers, LoadingResourceModifiers {

	protected HTMLElement?: HTMLVideoElement
	protected styles: Styles<MediaStyleInterface> = new Styles
	protected listeners?: Listeners<LoadingResourceListeners<HTMLVideoElement>>
	protected attribute?: ElementAttribute<SecurityPolicyAttribute>

	protected useCSSVariablesForMediaStyles?: boolean
	protected useSrcsetSource?: boolean

	protected content: string | URL
	protected loop: boolean = true


	protected poster?: string | URL



	protected override importProperty(view: BackgroundVideoView): ReturnType<ViewModifiers<any>['importProperty']> {
		this.loop = view.loop;
		this.poster = view.poster;
		super.importProperty(view);
	}







	protected merge(newRender: BackgroundVideoView, element: HTMLVideoElement): void {
		if (newRender.poster && this.poster?.toString() != newRender.poster.toString()) { this.poster = newRender.poster; element.poster = this.poster.toString(); }
		if (this.content.toString() != newRender.content.toString()) { this.content = newRender.content; element.src = this.content.toString(); }
		this.loop = newRender.loop;
		if (this.loop) element.loop = true;
	}
	protected generateHTMLElement(): HTMLVideoElement {
		let e = this.HTMLElement = document.createElement('video');
		e.classList.add('background-video');
		e.src = this.content.toString();
		if (this.loop) e.loop = true;
		if (this.poster) e.poster = this.poster.toString();
		e.autoplay = true;
		e.controls = false;
		e.muted = true;
		e.playsInline = true
		e.disablePictureInPicture = true;
		e.disableRemotePlayback = true;

		return e
	}



	public referrerPolicy(value: ReferrerPolicyOptions): this { this.safeAttribute.set('referrerpolicy', value); return this }
	public crossorigin(value: Crossorigin): this { this.safeAttribute.set('crossorigin', value); return this }
	public unInfinity(value: boolean = true): this { this.loop = !value; return this }


	public onLoad(value: () => void): this { this.safeListeners.set('load', () => value()); return this }
	public onError(value: (error: any) => void): this { this.safeListeners.set('error', event => value(event.error)); return this }




	constructor(src: string | URL, poster?: string | URL) {
		super();
		this.content = src;
		if (poster) this.poster = poster
	}

}


export function BackgroundVideo(src: string | URL, poster?: string): BackgroundVideoView { return new BackgroundVideoView(src, poster) }