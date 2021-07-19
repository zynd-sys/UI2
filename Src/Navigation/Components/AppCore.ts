import type { View } from "../../Elements/View"
import { ColorMode, PageDataColorMode } from "../../Data/PageData/PageDataColorMode";
import { AnimationStorage } from "../../Data/Storages/Animations"
import { AppLayerName, AppLayersClass } from "./Layers"
import { ViewStorageClass } from "./ViewStorage";
import { AppHistoryClass } from "./History";
import { MetaDescription } from "../MetaDescription";
import { LinkPathClass, PathType } from "./LinkPath";








export class AppCoreClass {

	protected popoverMod: boolean = false
	protected urlNow: string = window.location.pathname;

	protected animationPromise: Promise<void> | undefined = undefined
	protected link: LinkPathClass<any> | (new (...p: any[]) => View) | undefined = undefined

	protected readonly layers: AppLayersClass = new AppLayersClass
	protected readonly history: AppHistoryClass = new AppHistoryClass
	protected readonly ViewStorage: ViewStorageClass = new ViewStorageClass

	public globalColorMode?: ColorMode




	protected setErrorView(error: Error): void {
		console.error(error);
		this.popoverMod = false;
		this.layers.clearLayer('all');
		if (this.ViewStorage.ErrorView) this.layers.setLayer(AppLayerName.app, new this.ViewStorage.ErrorView(error));
	}
	protected setNotFoundView(path?: string): void {
		console.warn('not found', path);
		if (this.ViewStorage.notFoundView) this.layers.clearLayer('all').setLayer(AppLayerName.app, new this.ViewStorage.notFoundView());
	}
	protected setAppLayers(view: new (...p: any[]) => View, viewParametrs: any[], colorMode?: ColorMode, topScroll: boolean = true): void {
		PageDataColorMode.useOnlyColorMode(colorMode ? colorMode : this.globalColorMode);
		this.layers.setLayer(AppLayerName.app, new view(...viewParametrs));
		if (topScroll) window.scrollTo({ top: 0, left: 0 });

		MetaDescription.update();
	}




	protected render<V extends new (...p: any[]) => View>(view: V, viewParametrs: ConstructorParameters<V>, checkURL?: string) {
		this.link = undefined;
		if (this.popoverMod) { this.layers.setLayer(AppLayerName.popover, new view(...viewParametrs), true); return }

		const data = this.ViewStorage.getPath(view);
		if (!data) { this.setNotFoundView(view.name); return }

		let partPath: string = data.path;
		if (data.generic && typeof viewParametrs[0] == 'string') partPath += '~' + viewParametrs[0];
		this.history.navigate(partPath);
		if (checkURL && checkURL != window.location.pathname) console.warn(checkURL, '!=', window.location.pathname, 'in', view.name)

		this.setAppLayers(view, viewParametrs, data.colorMode);
		this.urlNow = window.location.pathname;
	}
	protected setLinkPath<V extends new (...p: any[]) => View>(linkPath: LinkPathClass<V>): V | Promise<V | undefined> { // viewParametrs: ConstructorParameters<V>
		let data = linkPath.getView();

		if (data instanceof Promise) {
			if (linkPath.previewValue) this.layers.setLayer(this.popoverMod ? AppLayerName.popover : AppLayerName.app, new linkPath.previewValue, this.popoverMod);
			this.history.navigate(linkPath.path, linkPath.pathType == PathType.root);

			this.link = linkPath
			// let url = window.location.pathname;
			return data.then(view => {
				// this.pathLink = undefined;
				// this.render(view, viewParametrs, url)
				return this.link == linkPath ? view : undefined
			});

		}

		return data //this.render(data, viewParametrs)
	}



	public navigate<V extends new (...p: any[]) => View>(view: V | LinkPathClass<V>, viewParametrs: ConstructorParameters<V>): void {
		// try {
		if (AnimationStorage.isAnimated) {
			if (!this.animationPromise) this.animationPromise = new Promise(resolve => AnimationStorage.addAnimationCompletionHandler(this, () => resolve()))
			
			let animationPromise = Promise.all([this.animationPromise, view instanceof LinkPathClass ? this.setLinkPath(view) : view]);
			if (view instanceof LinkPathClass) animationPromise.then(data => { if (data[1]) this.navigate(data[1], viewParametrs) })
			else {
				this.link = view;
				animationPromise.then(data => { if (this.link == data[1]) this.render(view, viewParametrs) })
			}
			return
		}

		if (view instanceof LinkPathClass) {
			let link = this.setLinkPath(view);
			if (link) if (link instanceof Promise) link.then(v => { if (v) this.render(v, viewParametrs) })
			else this.render(link, viewParametrs)

			return
		}
		this.render(view, viewParametrs)
		// } catch (error) { this.setErrorView(error) }
	}





















	public addPath(view: new (...p: any) => View, path: string, rootPath: boolean = false, genericPath: boolean = false, colorMode?: ColorMode): void {
		this.ViewStorage.add(view, { path: path, generic: genericPath, colorMode: colorMode })
		if (rootPath) this.history.addRootPath(path)
	}
	public addErrorPath(view: new (error: Error) => View): void { this.ViewStorage.ErrorView = view }
	public addNotFoundPath(view: new () => View): void { this.ViewStorage.notFoundView = view }
















	public generateURL<V extends new (...p: any) => View>(view: V | LinkPathClass<V>, id?: string): string {

		const pathData = view instanceof LinkPathClass ? view : this.ViewStorage.getPath(view);
		if (!pathData) {
			console.warn('not found part path for ', view instanceof LinkPathClass ? view.path : view.constructor.name, view);
			return window.location.pathname
		}
		return this.history.generateURL(id ? pathData.path + '~' + id : pathData.path, view instanceof LinkPathClass ? view.pathType == PathType.root : false)
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


















	protected init() {
		try {
			const url: URL = new URL(window.location.href);
			let pathSplit = url.pathname.replace(/\/$/, '').split('/');
			let lastPartPath = pathSplit[pathSplit.length - 1];

			let checkGeneric = lastPartPath.match(/(.+)~(.+)/);
			let genericID: string | undefined;
			if (checkGeneric) {
				lastPartPath = checkGeneric[1];
				genericID = checkGeneric[2];
			};

			const data = this.ViewStorage.getView(lastPartPath);
			if (!data) { this.setNotFoundView(lastPartPath); return }

			this.setAppLayers(data.view, [genericID], data.colorMode, false);
		} catch (error) { this.setErrorView(error) }
		window.addEventListener('popstate', () => { if (this.urlNow != window.location.pathname) return window.location.reload() })
	}

	constructor() {
		if (document.readyState != 'complete') window.addEventListener('load', () => this.init(), { once: true })
		else this.init()
	}
}