import type { ShapeSVGElementStyles, ShapeStyles } from '../../Styles/CSS/Types';
import { MainStyleSheet, CSSSelectore } from '../../Styles/CSS';
import { Styles } from '../../ViewConstructors/Modifiers/Styles';
import { ViewShapeElement } from '../../ViewConstructors/ViewShapes';



export interface ShapeSVGRectlementStyles extends ShapeSVGElementStyles {
	'rx'?: 'var(--rx)'
	'ry'?: 'var(--ry)'
}
export interface RectStyles extends ShapeStyles {
	'--rx'?: `${number}%`
	'--ry'?: `${number}%`
}


MainStyleSheet.add(
	new CSSSelectore<ShapeSVGRectlementStyles>('svg > rect', {
		'rx': 'var(--rx)',
		'ry': 'var(--ry)'
	})
)





export class RectangleView extends ViewShapeElement {
	protected styles: Styles<RectStyles> = new Styles

	protected content: any


	protected generateShapeElement(): SVGGeometryElement {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		element.width.baseVal.valueAsString = '100%';
		element.height.baseVal.valueAsString = '100%';
		return element
	}
	protected updateShapeElement?(): void


	public cornerRadius(radiusX: number, radiusY?: number): this {
		this.styles.set('--rx', `${radiusX}%`);
		if (radiusY) this.styles.set('--ry', `${radiusY}%`);
		return this
	}
}

export function Rectangle(): RectangleView { return new RectangleView() }
export function RoundedRectangle(radiusX: number, radiusY?: number): RectangleView { return new RectangleView().cornerRadius(radiusX, radiusY) }
