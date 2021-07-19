import type { View } from "../Elements/View";
import type { ColorMode } from "../Data/PageData/PageDataColorMode";
import { AppCoreClass } from "./Components/AppCore";







/** @deprecated */
export const App = new class AppNavigationClass {

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
	// public errorPath<V extends new (error: Error) => View>(view: V): V { this.system.addErrorPath(view); return view }
	// public notFoundPath<V extends new () => View>(view: V): V { console.log(this); this.system.addNotFoundPath(view); return view }
	public rootPath(value: string, colorMode?: ColorMode): <V extends new () => View>(view: V) => V {
		return view => {
			this.core.addPath(view, value, true, false, colorMode);
			return view
		}
	}
	public partPath(value: string, colorMode?: ColorMode): <V extends new () => View>(view: V) => V {
		return view => {
			this.core.addPath(view, value, false, false, colorMode);
			return view
		}
	}
	public genericPath(value: string, colorMode?: ColorMode): <V extends new (id: string) => View>(view: V) => V {
		return view => {
			this.core.addPath(view, value, false, true, colorMode);
			return view
		}
	}

	/** 
	 * * priorety 2 
	 */
	public setGlobalColorMode(value: ColorMode): void { this.core.globalColorMode = value; }
}
