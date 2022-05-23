import type { View } from '../../Elements/View'
import type { CompositingCoords } from '../../ViewConstructors/Modifiers/Compositing';
import type { ColorScheme } from '../../Styles/Colors/PrefersColorSchemeCSSMedia';
import { PageDataColorMode } from '../../Data/PageData/PageDataColorMode';
import { AnimationStorage } from '../../ViewConstructors/Modifiers/Animation/UIAnimation';
import { AppLayerName, AppLayersClass } from './Layers'
import { AppHistoryClass, NotFoundError } from './History';
import { MetaDescription } from '../MetaDescription';
import { LinkPathClass } from './LinkPath';
import { Manifest, ManifestItem, URLSegment } from './ManifestItem';








export class AppCoreClass {

	protected popoverMod: boolean = false
	protected urlNow: string = window.location.pathname;

	protected readonly manifest: Set<ManifestItem<string, new (...p: any[]) => View>> = new Set;
	protected readonly layers: AppLayersClass = new AppLayersClass
	protected readonly history: AppHistoryClass = new AppHistoryClass

	protected errorView?: new (error: Error) => View
	protected notFoundView?: new () => View




	protected setErrorView(error: Error): void {
		console.error(error);
		this.popoverMod = false;
		this.promiseInitializer = undefined;
		this.layers.clearLayer('all');
		if (this.errorView) this.layers.setLayer(AppLayerName.app, new this.errorView(error));
	}
	protected setAppLayers(view: new (...p: any[]) => View, viewParametrs: any[], colorMode?: ColorScheme, topScroll: boolean = true): void {
		PageDataColorMode.useOnlyColorMode(colorMode);
		this.layers.setLayer(AppLayerName.app, new view(...viewParametrs));
		if (topScroll) window.scrollTo({ top: 0, left: 0 });

		MetaDescription.update();
	}









	protected animationPromise: Promise<void> | undefined = undefined
	protected promiseInitializer: LinkPathClass<any> | (new () => View) | undefined = undefined

	protected getManifestItem(view: (new (...p: any[]) => View) | LinkPathClass<any>): undefined | ManifestItem<string, new (...p: any[]) => View> {
		if (!this.manifest) { console.error('navigate without app manifest'); return }

		if (view instanceof LinkPathClass) {
			for (let item of this.manifest) if (item.segment == view.segment) return item;
			return
		}

		for (let item of this.manifest) if (item.checkView(view)) return item;
	}
	protected promiseWithAnimation<V>(promise: Promise<V> | V): Promise<V> {
		if (!this.animationPromise) this.animationPromise = AnimationStorage.addAnimationCompletionHandler(this)
		return Promise.all([this.animationPromise, promise]).then(v => v[1]);
	}

	public async navigate<V extends new (...p: any[]) => View>(view: V | LinkPathClass<V>, viewParametrs: ConstructorParameters<V>): Promise<void> {
		try {
			if (this.popoverMod) {
				if (!(view instanceof LinkPathClass)) {
					this.layers.setLayer(AppLayerName.popover, new view(...viewParametrs), true);
					return
				}

				let manifestItem = this.getManifestItem(view);
				let v = (manifestItem ? manifestItem : view).getView();
				if (v instanceof Promise) v = await v;

				this.layers.setLayer(AppLayerName.popover, new v(...viewParametrs), true)
				return
			}



			let manifestItem = this.getManifestItem(view);
			let partPath: string | undefined;
			let viewv: new (...p: any[]) => View;
			this.promiseInitializer = view;

			if (manifestItem) {
				let promise = AnimationStorage.isAnimated ? this.promiseWithAnimation(manifestItem.getView()) : manifestItem.getView();
				if (promise instanceof Promise) promise = await promise;

				partPath = manifestItem.segment;
				if (manifestItem.segmentType == URLSegment.generic && typeof viewParametrs[0] == 'string') partPath += '~' + viewParametrs[0];
				viewv = promise;
			} else {
				console.error('not found manifest for ', view.constructor.name, view)

				let promise = view instanceof LinkPathClass ? view.getView() : view;
				if (AnimationStorage.isAnimated) promise = await this.promiseWithAnimation(promise);
				if (promise instanceof Promise) promise = await promise;
				viewv = promise;
			}

			if (this.promiseInitializer != view) return
			this.promiseInitializer = undefined;


			this.setAppLayers(viewv, viewParametrs, manifestItem?.colorScheme);
			if (typeof partPath == 'string') this.history.navigate(partPath);
			this.urlNow = window.location.pathname;

		} catch (error: any) { this.setErrorView(error) }
	}



















	public getRectElements(storage: Map<HTMLElement, CompositingCoords>): void { this.layers.getRectElements(storage) }

	public addErrorPath(view: new (error: Error) => View): void { this.errorView = view }
	public addNotFoundPath(view: new () => View): void { this.notFoundView = view }
	public addManifest(value: Manifest): void {
		if (this.manifest.size != 0) throw new Error('error replace manifest')
		value.forEach(v => { this.manifest.add(v); if (v.segmentType == URLSegment.root) this.history.addRootPath(v.segment) });
	}















	public generateURL<V extends new (...p: any) => View>(view: V | LinkPathClass<V>, id?: string): string | [destination: string, alternativedestination: string] {
		const manifestItem = this.getManifestItem(view);
		if (!manifestItem) {
			console.warn('not found part path for ', view instanceof LinkPathClass ? view.segment : view.constructor.name, view);
			return this.history.getURL()
		}

		if (this.popoverMod) return [this.history.getURL(), this.history.generateURL(id ? manifestItem.segment + '~' + id : manifestItem.segment)]
		else return this.history.generateURL(id ? manifestItem.segment + '~' + id : manifestItem.segment)
	}














	public setPopover(view: new (...p: any[]) => View, scrolling: boolean = false): void {
		if (this.popoverMod) { console.warn('popover is set'); return }

		if (scrolling) window.addEventListener('scroll', () => {
			this.layers.clearLayer(AppLayerName.popover, true);
			this.popoverMod = false;
		}, { passive: true, once: true });
		else document.body.style.setProperty('overflow', 'hidden');


		this.popoverMod = true;
		this.navigate(view, []);
	}
	public disablePopover(): void {
		if (!this.popoverMod) { console.warn('popover is disabled'); return }

		document.body.style.removeProperty('overflow');
		this.layers.clearLayer(AppLayerName.popover, true);

		this.popoverMod = false;
	}


















	protected async init(): Promise<void> {
		try {
			if (!this.manifest) throw new Error('not setup app manifest');

			let data = this.history.checkURL(this.manifest);

			let checkURL = window.location.pathname.match(/(.+)~(.+)/);
			let generateURL = undefined;
			if (checkURL) generateURL = checkURL[2]

			let view = data.getView();
			this.setAppLayers(view instanceof Promise ? await view : view, [generateURL], data.colorScheme, false);


		} catch (error: any) {
			if (error instanceof NotFoundError) {
				console.warn('not found', error.url);
				this.popoverMod = false;
				this.layers.clearLayer('all');
				if (this.notFoundView) this.layers.setLayer(AppLayerName.app, new this.notFoundView());
			} else {
				this.setErrorView(error)
			}
		}
		window.addEventListener('popstate', () => { if (this.urlNow != window.location.pathname) return window.location.reload() })
	}

	constructor() {
		if (document.readyState != 'complete') window.addEventListener('load', () => this.init(), { once: true })
		else this.init()
	}
}