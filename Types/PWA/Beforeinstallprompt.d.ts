

/**
 * The beforeinstallprompt event fires on devices when a user is about to be prompted to "install" a web application. It may be saved for later and used to prompt the user at a more suitable time.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
 * @NonStandard Check cross-browser support before using.
 */
interface BeforeInstallPromptEvent extends Event {

	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: Array<string>

	/** Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed". */
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed',
		platform: string
	}>

	/**
	 * Allows a developer to show the install prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>

}


interface WindowEventMap {
	beforeinstallprompt: BeforeInstallPromptEvent;
}
