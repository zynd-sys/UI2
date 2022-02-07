import type { View } from "../../Elements/View";
import { ManifestItem, URLSegment } from "./ManifestItem";



export class NotFoundError extends Error {
	public readonly url: string
	constructor(url: string, message?: string) {
		super(message);
		this.url = url;
	}
}



export class AppHistoryClass {
	protected url: string = ''
	protected readonly rootPaths: Set<string> = new Set

	protected setPage(url: string): void { window.history.pushState(undefined, '', url); }

	public addRootPath(path: string): void { this.rootPaths.add(path) }


	public generateURL(partPath: string): string {

		// switch to root path
		if (this.rootPaths.has(partPath)) return '/' + partPath

		// push path
		return this.url + '/' + partPath
	}



	public navigate(partPath: string): void {

		// switch to root path
		if (this.rootPaths.has(partPath)) {
			this.url = '/' + partPath;
			this.setPage(this.url)
			return
		}

		// push path
		this.url = this.url + '/' + partPath;
		this.setPage(this.url)
		return
	}







	public checkURL(manifest: Set<ManifestItem<string, new (...p: any[]) => View>>, url: string = window.location.pathname): ManifestItem<string, new () => View> {
		let newPath: string[] = ['']
		let pathSplit: string[] = url.replace(/\/$/, '').split('/');


		let manifestItem: ManifestItem<string, new (...p: any[]) => View> | undefined;
		if (pathSplit.length == 1) {
			for (let item of manifest) if (item.segmentType == URLSegment.root && item.segment == '') { manifestItem = item; break }
			if (manifestItem) return manifestItem
			throw new NotFoundError('not found start page manifest')
		}

		for (let i = 1; i < pathSplit.length; i++) {
			let segment: string = pathSplit[i]!;

			let checkGeneric = segment.match(/(.+)~(.+)/);
			let genericValue: string | undefined;
			if (checkGeneric) { segment = checkGeneric[1]!; genericValue = checkGeneric[2] };

			let addPath: string | undefined
			for (let item of manifest)
				if (item.segment == segment || (item.redirectsValue && item.redirectsValue.includes(segment))) {
					manifestItem = item;
					addPath = item.segmentType == URLSegment.generic && genericValue ? item.segment + '~' + genericValue : item.segment;
					break
				}

			if (manifestItem && manifestItem.segmentType == URLSegment.root && i != 1) throw new NotFoundError(`manifestItem("${manifestItem.segment}") is root path type`)
			if (addPath) newPath.push(addPath);
			else throw new NotFoundError(`not found path: ${url}`)
		}

		if (manifestItem) {
			let newURL = newPath.join('/')
			if (newURL != pathSplit.join('/')) window.history.replaceState(undefined, '', newURL);
			this.url = newURL;
			return manifestItem
		}
		throw new NotFoundError('not found manifest item')
	}




	constructor() { this.rootPaths.add('') }
}