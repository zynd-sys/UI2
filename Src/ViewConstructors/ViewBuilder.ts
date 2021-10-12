

function init() {
	let elementStyle = document.createElement('style');
	elementStyle.title = 'UILibrary/CoreStyles';
	elementStyle.textContent = `*{margin:0;padding:0;border:0 solid;box-sizing:border-box;transition-property:background-color,border-color;transition-duration:.6s;transition-timing-function:ease-in-out}:focus{outline:0}ui-layer,ui-view{display:contents}ui-layer[layer=popover]>ui-view>*{will-change:transform,filter,height,width,margin,padding;z-index:101;position:fixed;top:0;bottom:0;left:0;right:0}body{--safe-area-inset-top:env(safe-area-inset-top);--safe-area-inset-right:env(safe-area-inset-right);--safe-area-inset-bottom:env(safe-area-inset-bottom);--safe-area-inset-left:env(safe-area-inset-left)}ui-layer[layer=app]>ui-view>*{min-height:100vh;justify-content:start}.text-conteainer{display:block;max-width:100%;overflow:hidden;transition-property:background-color,border-color,color;user-select:none;-webkit-user-select:none;font-size:1rem;font-family:-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;color:inherit;-moz-osx-font-smoothing:grayscale;overflow-wrap:break-word;text-overflow:ellipsis}a{color:inherit;text-decoration:none}.text-conteainer.stack>*{vertical-align:text-bottom;-webkit-user-select:inherit;user-select:inherit;color:inherit;font:inherit}.text-conteainer.stack>.text-conteainer{display:inline-block}.text-conteainer.stack>.container{display:inline-flex}.text-conteainer.stack>.container.grid{display:inline-grid}picture,video{display:block;overflow:hidden;user-select:none;-webkit-user-select:none;max-width:100%;width:100%;max-height:100%;height:100%;position:relative}picture img,picture::after{display:block;position:absolute;top:0;bottom:0;left:0;right:0;height:100%;width:100%}picture{--object-fit:cover;--object-position:50% 50%;--overlay-color:rgba(0, 0, 0, 0)}picture img{object-fit:var(--object-fit);object-position:var(--object-position)}picture::after{content:"";background:var(--overlay-color)}video{object-fit:cover}.container{display:flex;width:100%;flex-flow:column wrap;justify-content:center;align-items:center;align-content:center}.grid{display:grid;grid-auto-flow:column}.scroll{flex-wrap:nowrap}.scroll>*{flex-shrink:0}.depth{position:relative;justify-content:center;align-items:center}.depth>*{position:absolute;top:0;bottom:0;left:0;right:0}.depth>:last-child{top:auto;bottom:auto;left:auto;right:auto}a.container,button.container,label.container,span.container{flex-direction:row;max-width:100%;width:auto}button,label{cursor:pointer}hr{display:block;min-width:1px;min-height:1px;justify-self:stretch;align-self:stretch;background-color:#000}hr.spacer{flex-grow:1;background-color:transparent}button,input,textarea{border-radius:0;outline:0;box-shadow:none;background-color:transparent}input[type=date]{min-height:54px}textarea{resize:none;max-width:100%}input.text-conteainer,textarea.text-conteainer{user-select:auto;-webkit-user-select:auto}:-webkit-autofill{box-shadow:0 0 100px #fff inset;-webkit-text-fill-color:currentColor}.hiddenElement{position:absolute;-webkit-appearance:none;-moz-appearance:none;appearance:none;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}`;
	document.head.appendChild(elementStyle);
}

if (document.readyState != 'complete') window.addEventListener('load', () => init(), { once: true })
else init()





export abstract class ViewBuilder {
	public abstract render(newRender?: ViewBuilder, ...param: any[]): HTMLElement
	public abstract destroy(...param: any[]): void | Promise<void>


	protected abstract content: any
}

