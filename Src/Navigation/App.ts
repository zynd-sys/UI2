import type { View } from 'Elements/View';
import type { ColorMode } from 'Data/PageData/PageDataColorMode';
import type { Manifest } from './Components/ManifestItem';
import { AppCoreClass } from './Components/AppCore';








export const App = new class AppClass {

	public readonly core: AppCoreClass = new AppCoreClass

	public errorPath(): <V extends new (error: Error) => View>(view: V) => V { // colorMode?: ColorMode
		return view => {
			this.core.addErrorPath(view);
			return view
		}
	}
	public notFoundPath(): <V extends new () => View>(view: V) => V { // colorMode?: ColorMode
		return view => {
			this.core.addNotFoundPath(view);
			return view
		}
	}


	public useManifest(...value: Manifest): void { this.core.addManifest(value); }


	/**
	 * * priorety 2
	 */
	public setGlobalColorMode(value: ColorMode): void { this.core.globalColorMode = value; }
}