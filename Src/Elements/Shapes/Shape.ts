import type { StrokeLinecap } from '../../ViewConstructors/Enum/StrokeLinecap';
import type { Path } from './Path'
import type { ShapeStyles, ShapeSVGElementStyles } from '../../ViewConstructors/Modifiers/CSS/Types/ShapeStyles';
import { MainStyleSheet } from '../../ViewConstructors/Modifiers/CSS/MainStyleSheet';
import { ViewShapeElement } from '../../ViewConstructors/ViewShapes'
import { CSSSelectore } from '../../ViewConstructors/Modifiers/CSS/CSSSelectore';
import { Styles } from '../../ViewConstructors/Modifiers/CSS/Styles';



const supportCSSdProperty: boolean = 'd' in document.documentElement.style;


export interface ShapeSVGPathElementStyles extends ShapeSVGElementStyles {
	'd'?: 'var(--d)'
}
export interface PathStyles extends ShapeStyles {
	'--d'?: Path | string
}

if (supportCSSdProperty) MainStyleSheet.add(
	new CSSSelectore<ShapeSVGPathElementStyles>('svg > path', {
		'd': 'var(--d)'
	})
)











export class ShapeView extends ViewShapeElement {

	protected styles: Styles<PathStyles> = new Styles

	protected content: Path



	protected generateShapeElement(): SVGGeometryElement {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.updateShapeElement(this, element);
		return element
	}


	protected updateShapeElement(view: ShapeView, element: SVGPathElement): void {
		if (supportCSSdProperty) view.styles.set('--d', this.content.toCSSValue());
		else element.setAttribute('d', this.content.toString());
	}




	/** @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-rule */
	public fillRuleEvenodd(value: true): this { if (value) this.styles.set('--fill-rule', 'evenodd'); return this }
	public strokeLinecap(value: StrokeLinecap): this { this.styles.set('--stroke-linecap', value); return this }


	constructor(path: Path) {
		super();
		this.content = path
	}
}

export function Shape(value: Path): ShapeView { return new ShapeView(value) }