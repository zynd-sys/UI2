



export class AppHistoryClass {
	protected url: [string, string, ...string[]]
	protected readonly rootPaths: Map<string, [string, string, ...string[]]> = new Map()

	protected setPage(url: string): void { window.history.pushState(undefined, '', url); }

	public addRootPath(path: string): void { this.rootPaths.set(path, ['', path]) }


	public generateURL(partPath: string, rootPath?: boolean): string {
		// go to root path
		let firstPart = this.url[1];
		if (partPath == firstPart) return '/' + firstPart

		// go to previous path
		let previousPart = this.url[this.url.length - 1];
		if (partPath == previousPart) return this.url.slice(0, -1).join('/')

		// switch to root path
		let path = rootPath ? ['', partPath] : this.rootPaths.get(partPath);
		if (path) return path.join('/')

		// push path
		return this.url.join('/') + '/' + partPath
	}



	public navigate(partPath: string, rootPath?: boolean): void {
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
		let path = rootPath ? ['', partPath] as [string, string, ...string[]] : this.rootPaths.get(partPath);
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





	constructor() {
		this.rootPaths.set('', this.url = ['', ''])

		let url = window.location.pathname.split('/') as [string, string, ...string[]];

		let firstPart = url[1];
		if (!this.rootPaths.has(firstPart)) firstPart = '';
		this.rootPaths.set(firstPart, this.url = url)
	}
}