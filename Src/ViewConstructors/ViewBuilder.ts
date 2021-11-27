import type { CompositingCoords } from "./Styles/Compositing";


function init() {
	let elementStyle = document.createElement('style');
	elementStyle.title = 'UILibrary/CoreStyles';
	elementStyle.textContent = `*{margin:0;padding:0;border-width:0;box-sizing:border-box;transition-property:background-color,border-color;transition-duration:.6s;transition-timing-function:ease-in-out}:focus{outline:0}ui-layer,ui-view{display:contents}ui-layer[layer=popover]>ui-view>*{will-change:transform,filter,height,width,margin,padding;z-index:101;position:fixed;inset:0}body{--safe-area-inset-top:env(safe-area-inset-top);--safe-area-inset-right:env(safe-area-inset-right);--safe-area-inset-bottom:env(safe-area-inset-bottom);--safe-area-inset-left:env(safe-area-inset-left)}ui-layer[layer=app]>ui-view>*{min-block-size:100vh;justify-content:start;background-color:var(--background-color)}.text-conteainer{display:block;max-inline-size:100%;overflow:hidden;transition-property:background-color,border-color,color;user-select:none;-webkit-user-select:none;font-size:1rem;font-family:-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;color:inherit;-moz-osx-font-smoothing:grayscale;overflow-wrap:break-word;text-overflow:ellipsis}a{color:inherit;text-decoration:none}.text-conteainer.stack>*{vertical-align:text-bottom;-webkit-user-select:inherit;user-select:inherit;color:inherit;font:inherit}.text-conteainer.stack>.text-conteainer{display:inline-block}.text-conteainer.stack>.container{display:inline-flex}.text-conteainer.stack>.container.grid{display:inline-grid}picture,video{display:block;overflow:hidden;user-select:none;-webkit-user-select:none;max-inline-size:100%;inline-size:100%;position:relative}picture img,picture::after{display:block;position:absolute;inset:0;block-size:100%;max-inline-size:100%;inline-size:100%}picture{--object-fit:cover;--object-position:50% 50%;--overlay-color:rgba(0, 0, 0, 0)}picture img{object-fit:var(--object-fit);object-position:var(--object-position)}picture::after{content:"";background:var(--overlay-color)}video{object-fit:cover}.container{display:flex;inline-size:100%;flex-flow:column wrap;justify-content:center;align-items:center;align-content:center;overscroll-behavior:none}.grid{display:grid;grid-auto-flow:column}.scroll{flex-wrap:nowrap}.scroll>*{flex-shrink:0}.depth{position:relative}.depth>*{position:absolute;inset:0}.depth>:last-child{inset:auto}a.container,button.container,label.container,span.container{flex-direction:row;max-inline-size:100%;inline-size:auto}button,label{cursor:pointer}hr{display:block;min-inline-size:1px;min-block-size:1px;justify-self:stretch;align-self:stretch;background-color:#000}hr.spacer{flex-grow:1;min-inline-size:auto;min-block-size:auto;background-color:transparent}button,input,textarea{border-radius:0;outline:0;box-shadow:none;background-color:transparent}input[type=date]{min-block-size:54px}textarea{resize:none;max-inline-size:100%}input.text-conteainer,textarea.text-conteainer{user-select:auto;-webkit-user-select:auto}:-webkit-autofill{box-shadow:0 0 100px #fff inset;-webkit-text-fill-color:currentColor}.hiddenElement{position:absolute;-webkit-appearance:none;-moz-appearance:none;appearance:none;inline-size:1px;block-size:1px;overflow:hidden;clip:rect(0 0 0 0)}`;
	document.head.appendChild(elementStyle);
}

if (document.readyState != 'complete') window.addEventListener('load', () => init(), { once: true })
else init()





export abstract class ViewBuilder {
	public abstract render(newRender?: ViewBuilder, withAnimation?: boolean, ...param: any[]): HTMLElement
	public abstract destroy(withAnimation?: boolean, ...param: any[]): void | Promise<void>
	public abstract getRectElements(storage: Map<HTMLElement, CompositingCoords>): void


	protected abstract content: any
}

