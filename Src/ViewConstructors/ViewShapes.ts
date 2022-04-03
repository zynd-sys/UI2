import type { StrokeLinejoin } from "./Enum/StrokeLinejoin";
import type { Color } from "./Modifiers/Colors";
import type { ElementAttribute, ElementAttributeInterface } from "./Modifiers/Attributes";
import type { ShapeStyles, ShapeSVGElementStyles } from "./Modifiers/CSS/Types/ShapeStyles";
import type { Listeners, ListenersInterface } from "./Modifiers/Listeners/Listeners";
import type { Styles } from "./Modifiers/CSS/Styles";
import { ViewModifiers } from "./ViewModifiers";
import { MainStyleSheet } from "./Modifiers/CSS/MainStyleSheet";
import { CSSSelectore } from "./Modifiers/CSS/CSSSelectore";




MainStyleSheet.add(
	new CSSSelectore<ShapeSVGElementStyles>('svg > *', {
		'fill': 'var(--fill)',
		'fill-opacity': 'var(--fill-opacity)',
		'fill-rule': 'var(--fill-rule)',
		'stroke-color': 'var(--stroke-color)',
		'stroke-width': 'var(--stroke-width)',
		'stroke-dasharray': 'var(--stroke-dasharray)',
		'stroke-dashoffset': 'var(--stroke-dashoffset)',
		'stroke-linecap': 'var(--stroke-linecap)',
		'stroke-linejoin': 'var(--stroke-linejoin)',
		'stroke-miterlimit': 'var(--stroke-miterlimit)',
		'stroke-opacity': 'var(--stroke-opacity)',
		'transition': 'inherit'
	})
)



/** @experimental */
export abstract class ViewShapeElement extends ViewModifiers<{ parent: HTMLElement, shape: SVGGeometryElement }> {
	protected HTMLElement?: { parent: HTMLElement; shape: SVGGeometryElement; }

	protected abstract override styles: Styles<ShapeStyles>
	protected listeners?: Listeners<ListenersInterface<any>>
	protected attribute?: ElementAttribute<ElementAttributeInterface>



	protected generateHTMLElement(): { parent: HTMLElement; shape: SVGGeometryElement; } {
		let parent = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		let shape = parent.appendChild(this.generateShapeElement());
		parent.setAttribute('viewbox', '0 0 1 1');

		return {
			parent: parent as unknown as HTMLElement,
			shape: shape
		}
	}
	protected merge(view: ViewShapeElement, HTMLElement: { parent: HTMLElement, shape: SVGGeometryElement }): void {
		if (this.updateShapeElement) this.updateShapeElement(view, HTMLElement.shape);
	}

	protected abstract updateShapeElement?(view: ViewShapeElement, element: SVGGeometryElement): void
	protected abstract generateShapeElement(): SVGGeometryElement






	public fill(value: Color): this { this.styles.set('--fill', value); return this }
	/** @param value range 0..1 */
	public fillOpacity(value: number): this { this.styles.set('--fill-opacity', value); return this }
	public strokeColor(value: Color): this { this.styles.set('--stroke-color', value); return this }
	public strokeWidth(value: number): this { this.styles.set('--stroke-width', value); return this }
	/** @param value range 0..1 */
	public strokeOpacity(value: number): this { this.styles.set('--stroke-opacity', value); return this }
	public strokeDasharray(...value: number[]): this { this.styles.set('--stroke-dasharray', value.join(' ')); return this }
	public strokeDashoffset(value: number): this { this.styles.set('--stroke-dashoffset', value); return this }
	public strokeLinejoin(value: StrokeLinejoin): this { this.styles.set('--stroke-linejoin', value); return this }
	public strokeMiterlimit(value: number): this { this.styles.set('--stroke-miterlimit', value); return this }
}
