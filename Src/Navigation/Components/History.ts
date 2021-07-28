import type { View } from "../../Elements/View";
import { ManifestItem, PathType } from "./ManifestItem";



export class NotFoundError extends Error {
	public readonly url: string
	constructor(url: string, message?: string) {
		super(message);
		this.url = url;
	}
}



export class AppHistoryClass {
	protected url: [string, string, ...string[]]
	protected readonly rootPaths: Map<string, [string, string, ...string[]]> = new Map()

	protected setPage(url: string): void { window.history.pushState(undefined, '', url); }

	public addRootPath(path: string): void { this.rootPaths.set(path, ['', path]) }


	public generateURL(partPath: string): string {
		// go to root path
		if (partPath == this.url[1]) return '/' + partPath

		// go to previous path
		if (partPath == this.url[this.url.length - 1]) return this.url.slice(0, -1).join('/')

		// switch to root path
		let path = this.rootPaths.get(partPath);
		if (path) return path.join('/')

		// push path
		return this.url.join('/') + '/' + partPath
	}



	public navigate(partPath: string): void {
		let firstPart = this.url[1];

		// go to root start path 
		if (partPath == firstPart) {
			this.setPage('/' + firstPart);
			this.url.length = 0;
			this.url.push(partPath);
			return
		}

		// go to previous path
		let previousPart = this.url[this.url.length - 1];
		if (partPath == previousPart) { this.url.pop(); this.setPage(this.url.join('/')); return }

		// switch to root path
		let path = this.rootPaths.get(partPath);
		if (path) {
			this.rootPaths.set(firstPart, this.url);
			this.url = path;

			this.setPage(this.url.join('/'))
			return
		}

		// push path
		this.url.push(partPath);
		this.setPage(this.url.join('/'))
		return
	}







	public checkURL(manifest: Set<ManifestItem<string, new (...p: any[]) => View>>, url: string = window.location.pathname): ManifestItem<string, new () => View> {
		let newPath: string[] = ['']
		let pathSplit: string[] = url.replace(/\/$/, '').split('/');


		let manifestItem: ManifestItem<string, new (...p: any[]) => View> | undefined;
		for (let i = 1; i < pathSplit.length; i++) {
			let partPath: string = pathSplit[i];

			let checkGeneric = pathSplit[i].match(/(.+)~(.+)/);
			if (checkGeneric) partPath = checkGeneric[1];

			let addPath: string | undefined
			for (let item of manifest) {
				if (item.pathType == PathType.root && i != 1) throw new Error(`manifest item is root path type. manifest.path: ${item.path}`)

				if (item.path == partPath) {
					manifestItem = item;
					addPath = item.pathType == PathType.generic ? pathSplit[i] : partPath;
					break
				}
				else if (item.redirectsValue && item.redirectsValue.includes(partPath)) {
					manifestItem = item;
					addPath = item.path;
					break
				}
			}
			if (addPath) newPath.push(addPath);
			else new NotFoundError(url)
		}

		if (!manifestItem) for (let item of manifest) { if (item.pathType == PathType.root && item.path == '') { manifestItem = item; break } }

		let newURL = newPath.join('/')
		if (newURL != pathSplit.join('/')) window.history.replaceState(undefined, '', newURL)

		if (manifestItem) return manifestItem
		else throw new Error('not found manifest item')
	}




	constructor() {
		this.rootPaths.set('', this.url = ['', ''])

		let url = window.location.pathname.split('/') as [string, string, ...string[]];

		let firstPart = url[1];
		if (!this.rootPaths.has(firstPart)) firstPart = '';
		this.rootPaths.set(firstPart, this.url = url)
	}
}