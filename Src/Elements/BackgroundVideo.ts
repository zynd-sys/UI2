import type { SecurityPolicyAttribute, ElementAttribute } from '../ViewConstructors/Modifiers/Attributes';
import type { Listeners, LoadingResourceListeners } from '../ViewConstructors/Modifiers/Listeners/Listeners';
import type { ViewModifiers } from '../ViewConstructors/ViewModifiers';
import { MediaFit } from '../ViewConstructors/Enum/MediaFit';
import { Styles } from '../ViewConstructors/Modifiers/CSS/Styles';
import { MainStyleSheet } from '../ViewConstructors/Modifiers/CSS/MainStyleSheet';
import { CSSSelectore } from '../ViewConstructors/Modifiers/CSS/CSSSelectore';
import { ViewMediaElement, MediaStyleInterface } from '../ViewConstructors/ViewMediaElement';
import type { ViewsList } from '../ViewConstructors/Modifiers/ListView';















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






export class BackgroundVideoView extends ViewMediaElement<HTMLVideoElement, string>  {

	protected HTMLElement?: HTMLVideoElement
	protected styles: Styles<MediaStyleInterface> = new Styles
	protected listeners?: Listeners<LoadingResourceListeners<HTMLVideoElement>>
	protected attribute?: ElementAttribute<SecurityPolicyAttribute>
	protected sourceList?: ViewsList

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

		if (newRender.sourceList) {
			let newSourceList: ViewsList | undefined = newRender.sourceList;
			if (!this.sourceList) { this.sourceList = newRender.sourceList; newSourceList = undefined; }
			this.sourceList.render(element, false, newSourceList);
		} else if (this.sourceList) {
			this.sourceList.destroy();
			this.sourceList = undefined;
		}
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
		this.sourceList?.render(e)

		return e
	}




	public unInfinity(value: boolean = true): this { this.loop = !value; return this }







	constructor(src: string | URL, poster?: string | URL) {
		super();
		this.content = src;
		if (poster) this.poster = poster
	}

}


export function BackgroundVideo(src: string | URL, poster?: string): BackgroundVideoView { return new BackgroundVideoView(src, poster) }