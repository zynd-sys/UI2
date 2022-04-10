


export enum LinkTarget {
	sefl = '_self',
	blank = '_blank',
	parent = '_parent',
	top = '_top',
	/**
	 * Supports
	 * mimetype: model/vnd.usdz+zip
	 * @NonStandard Check cross-browser support before using.
	 * @see https://webkit.org/blog/8421/viewing-augmented-reality-assets-in-safari-for-ios/
	 */
	ar = 'ar'
}