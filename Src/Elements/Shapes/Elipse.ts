import type { ShapeSVGElementStyles, ShapeStyles } from '../../Styles/CSS/Types';
import type { Point } from '../../ViewConstructors/Modifiers/Listeners/Gesture/Point';
import { MainStyleSheet, CSSSelectore } from '../../Styles/CSS';
import { Styles } from '../../ViewConstructors/Modifiers/Styles';
import { ViewShapeElement } from '../../ViewConstructors/ViewShapes';




export interface ShapeSVGEllipselementStyles extends ShapeSVGElementStyles {
	'rx'?: 'var(--rx)'
	'cx'?: 'var(--cx)'
	'ry'?: 'var(--ry)'
	'cy'?: 'var(--cy)'
}
export interface EllipseStyles extends ShapeStyles {
	'--rx'?: `${number}%`
	'--cx'?: `${number}%`
	'--ry'?: `${number}%`
	'--cy'?: `${number}%`
}


MainStyleSheet.add(
	new CSSSelectore<ShapeSVGEllipselementStyles>('svg > ellipse', {
		'rx': 'var(--rx)',
		'cx': 'var(--cx)',
		'ry': 'var(--ry)',
		'cy': 'var(--cy)'
	})
)





export class EllipseView extends ViewShapeElement {
	protected styles: Styles<EllipseStyles> = new Styles

	protected content: any

	protected generateShapeElement(): SVGGeometryElement {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
		return element
	}
	protected updateShapeElement?(): void


	/**
	 *
	 * @param radius range 0..100
	 * @param radius2 range 0..100
	 */
	constructor(radius1: Point, radius2: Point) {
		super();
		this.styles
			.set('--rx', `${radius1.x}%`)
			.set('--ry', `${radius2.y}%`)
			.set('--cx', `${radius1.x}%`)
			.set('--cy', `${radius2.y}%`);
	}
}

export function Ellipse(radius1: Point, radius2: Point): EllipseView { return new EllipseView(radius1, radius2) }
