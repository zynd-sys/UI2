
/** @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox */
export enum SandboxPermission {
	downloadsWithoutUserActivation = 'allow-downloads-without-user-activation',
	storageAccessByUserActivation = 'allow-storage-access-by-user-activation',
	downloads = 'allow-downloads',
	forms = 'allow-forms',
	modals = 'allow-modals',
	orientationLock = 'allow-orientation-lock',
	pointerLock = 'allow-pointer-lock',
	popups = 'allow-popups',
	popupsToEscapeSandbox = 'allow-popups-to-escape-sandbox',
	presentation = 'allow-presentation',
	sameOrigin = 'allow-same-origin',
	scripts = 'allow-scripts',
	topNavigation = 'allow-top-navigation',
	topNavigationByUserActivation = 'allow-top-navigation-by-user-activation',
}