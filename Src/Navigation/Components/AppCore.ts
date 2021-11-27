import type { View } from "../../Elements/View"
import type { CompositingCoords } from "../../ViewConstructors/Styles/Compositing";
import { ColorMode, PageDataColorMode } from "../../Data/PageData/PageDataColorMode";
import { AnimationStorage } from "../../Data/Storages/Animations"
import { AppLayerName, AppLayersClass } from "./Layers"
import { AppHistoryClass, NotFoundError } from "./History";
import { MetaDescription } from "../MetaDescription";
import { LinkPathClass } from "./LinkPath";
import { ManifestItem, PathType } from "./ManifestItem";








export class AppCoreClass {

	protected popoverMod: boolean = false
	protected urlNow: string = window.location.pathname;

	protected readonly manifest: Set<ManifestItem<string, new (...p: any[]) => View>> = new Set;
	protected readonly layers: AppLayersClass = new AppLayersClass
	protected readonly history: AppHistoryClass = new AppHistoryClass

	protected errorView?: new (error: Error) => View
	protected notFoundView?: new () => View

	public globalColorMode?: ColorMode




	protected setErrorView(error: Error): void {
		console.error(error);
		this.popoverMod = false;
		this.promiseInitializer = undefined;
		this.layers.clearLayer('all');
		if (this.errorView) this.layers.setLayer(AppLayerName.app, new this.errorView(error));
	}
	protected setAppLayers(view: new (...p: any[]) => View, viewParametrs: any[], colorMode?: ColorMode, topScroll: boolean = true): void {
		PageDataColorMode.useOnlyColorMode(colorMode ? colorMode : this.globalColorMode);
		this.layers.setLayer(AppLayerName.app, new view(...viewParametrs));
		if (topScroll) window.scrollTo({ top: 0, left: 0 });

		MetaDescription.update();
	}









	protected animationPromise: Promise<void> | undefined = undefined
	protected promiseInitializer: LinkPathClass<any> | (new () => View) | undefined = undefined

	protected getManifestItem(view: (new (...p: any[]) => View) | LinkPathClass<any>): undefined | ManifestItem<string, new (...p: any[]) => View> {
		if (!this.manifest) { console.error('navigate without app manifest'); return }

		if (view instanceof LinkPathClass) { for (let item of this.manifest) if (item.path == view.path) return item; return }
		for (let item of this.manifest) if (item.checkView(view)) return item;
	}
	protected promiseWithAnimation<V>(promise: Promise<V> | V): Promise<V> {
		if (!this.animationPromise) this.animationPromise = new Promise(resolve => AnimationStorage.addAnimationCompletionHandler(this, () => resolve()))
		return Promise.all([this.animationPromise, promise]).then(v => v[1]);
	}

	public async navigate<V extends new (...p: any[]) => View>(view: V | LinkPathClass<V>, viewParametrs: ConstructorParameters<V>): Promise<void> {
		try {

			let manifestItem = this.getManifestItem(view);
			let viewv: new (...p: any[]) => View;

			if (manifestItem) {
				this.promiseInitializer = view
				viewv = await this.promiseWithAnimation(manifestItem.view);

				if (!this.popoverMod) {
					let partPath: string = manifestItem.path;
					if (manifestItem.pathType == PathType.generic && typeof viewParametrs[0] == 'string') partPath += '~' + viewParametrs[0];
					this.history.navigate(partPath);
				}
			} else {
				if (!this.popoverMod) console.error('not found manifest for ', view.constructor.name, view)
				this.promiseInitializer = view;

				if (view instanceof LinkPathClass) {
					if (view.previewValue) this.layers.setLayer(this.popoverMod ? AppLayerName.popover : AppLayerName.app, new view.previewValue, this.popoverMod);
					viewv = await this.promiseWithAnimation(view.getView());
				}
				else viewv = await this.promiseWithAnimation(view);
			}

			if (this.promiseInitializer != view) return
			this.promiseInitializer = undefined;

			if (this.popoverMod) { this.layers.setLayer(AppLayerName.popover, new viewv(...viewParametrs), true); return }


			this.setAppLayers(viewv, viewParametrs, manifestItem?.colorModeValue);
			this.urlNow = window.location.pathname;

		} catch (error: any) { this.setErrorView(error) }
	}



















	public getRectElements(storage: Map<HTMLElement,CompositingCoords>): void { this.layers.getRectElements(storage) }

	public addErrorPath(view: new (error: Error) => View): void { this.errorView = view }
	public addNotFoundPath(view: new () => View): void { this.notFoundView = view }
	public addManifest(value: ManifestItem<any, any>[]): void {
		if (this.manifest.size != 0) throw new Error('error replace manifest')
		value.forEach(v => { this.manifest.add(v); if (v.pathType == PathType.root) this.history.addRootPath(v.path) });
	}
















	public generateURL<V extends new (...p: any) => View>(view: V | LinkPathClass<V>, id?: string): string {
		const manifestItem = this.getManifestItem(view);
		if (!manifestItem) {
			console.warn('not found part path for ', view instanceof LinkPathClass ? view.path : view.constructor.name, view);
			return window.location.pathname
		}
		return this.history.generateURL(id ? manifestItem.path + '~' + id : manifestItem.path)
	}














	public setPopover(view: new (...p: any[]) => View, scroll: boolean = false): void {
		if (this.popoverMod) { console.warn('popover is set'); return }

		if (scroll) window.addEventListener('scroll', () => {
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

			this.setAppLayers(await data.view, [generateURL], data.colorModeValue, false);


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