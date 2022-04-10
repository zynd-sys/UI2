


/**
 * Referrer Policy
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
 */
 export enum ReferrerPolicyOptions {
	/** meaning that the Referer: HTTP header will not be sent */
	noReferrer = 'no-referrer',
	/** meaning that the referrer will be the origin of the page, that is roughly the scheme, the host and the port */
	origin = 'origin',
	/** meaning that the referrer will include the origin and the path (but not the fragment, password, or username). This case is unsafe as it can leak path information that has been concealed to third-party by using TLS. */
	unsafeUrl = 'unsafe-url'
}