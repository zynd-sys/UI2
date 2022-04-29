import type { ShapeStyles } from '../../ViewConstructors/Modifiers/CSS/Types/ShapeStyles';
import { Styles } from '../../ViewConstructors/Modifiers/CSS/Styles';
import { ViewShapeElement } from '../../ViewConstructors/ViewShapes';




export class CircleView extends ViewShapeElement {
	protected styles: Styles<ShapeStyles> = new Styles

	protected content: any;


	protected generateShapeElement(): SVGGeometryElement {
		let element = document.createElementNS('http://www.w3.org/2000/svg','circle');
		element.cx.baseVal.valueAsString = '50%';
		element.cy.baseVal.valueAsString = '50%';
		element.r.baseVal.valueAsString = '50%';
		return element
	}
	protected updateShapeElement?():void


}

export function Circle(): CircleView { return new CircleView() }