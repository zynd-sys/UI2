import type { Point } from "../../ViewConstructors/Modifiers/Listeners/Gesture/Point";

type SVGPathSeparator = `${' ' | ','}`
type SVGPathCommandSeparator<T extends string> = `${T}${' ' | ''}`

type SVGPathPoint = `${number}${SVGPathSeparator}${number}`

type SVGPathMove = `${SVGPathCommandSeparator<'M' | 'm'>}${SVGPathPoint}`
type SVGPathLine = `${SVGPathCommandSeparator<'L' | 'l'>}${SVGPathPoint}`
// type SVGPathHorizontalLine = `${SVGPathCommandSeparator<'H' | 'h'>}${number}`
// type SVGPathVerticallLine = `${SVGPathCommandSeparator<'V' | 'V'>}${number}`
type SVGPathCurve = `${SVGPathCommandSeparator<'C' | 'c'>}${SVGPathPoint}${SVGPathSeparator}${SVGPathPoint}${SVGPathSeparator}${SVGPathPoint}`
// type SVGPathCurveSmooth = `${SVGPathCommandSeparator<'S' | 's'>}${SVGPathPoint}${SVGPathSeparator}${SVGPathPoint}`
type SVGPathQuardCurve = `${SVGPathCommandSeparator<'Q' | 'q'>}${SVGPathPoint}${SVGPathSeparator}${SVGPathPoint}`
// type SVGPathQuardCurveSmooth = `${SVGPathCommandSeparator<'T' | 't'>}${SVGPathPoint}`
type SVGPathArc = `${SVGPathCommandSeparator<'A' | 'a'>}${number}${SVGPathSeparator}${number}${SVGPathSeparator}${number}${SVGPathSeparator}${0 | 1}${SVGPathSeparator}${0 | 1}${SVGPathSeparator}${SVGPathPoint}`
// type SVGPathClose = `${' ' | ''}${'z' | 'Z'}`

// type SVGPathSegment = `${SVGPathMove | SVGPathLine | SVGPathHorizontalLine | SVGPathVerticallLine | SVGPathCurve | SVGPathCurveSmooth | SVGPathQuardCurve | SVGPathQuardCurveSmooth | SVGPathArc | SVGPathClose}${' ' | ''}${SVGPathSegment | ''}` | ''










/**
 * @experimental
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands
 */
export class Path {
	protected viewport?: { height: number, width: number }

	protected value: string = 'M0 0'

	protected addValue<T extends SVGPathMove | SVGPathLine | SVGPathCurve | SVGPathQuardCurve | SVGPathArc>(value: T): void {
		this.value += ' ' + value;
	}
	protected pointTransform(point: Point): `${number} ${number}` { const v = this.viewport; return v ? `${point.x / v.width} ${point.y / v.height}` : `${point.x} ${point.y}` }



	public addMove(to: Point, absoluteCoordinates: boolean = false): this {
		this.addValue<SVGPathMove>(`${absoluteCoordinates ? 'M' : 'm'}${this.pointTransform(to)}`);
		return this
	}
	public addLine(to: Point): this {
		this.addValue<SVGPathLine>(`l${this.pointTransform(to)}`)
		return this
	}
	public addCurve(to: Point, control1: Point, control2: Point): this {
		this.addValue<SVGPathCurve>(`c${this.pointTransform(control1)} ${this.pointTransform(control2)} ${this.pointTransform(to)}`);
		return this
	}
	public addQuadCurve(to: Point, control: Point): this {
		this.addValue<SVGPathQuardCurve>(`q${this.pointTransform(control)} ${this.pointTransform(to)}`);
		return this
	}
	/**
	 *
	 * @param angle represents a rotation (in degrees) of the ellipse relative to the x-axis
	 * @param useLargeArc [large-arc-flag] allows to chose one of the large arc (`true`) or small arc (`false`). Defualt `true`
	 * @param clockwiseTurningArc [sweep-flag] allows to chose one of the clockwise turning arc (`true`) or counterclockwise turning arc (`false`). Defualt `true`
	 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#elliptical_arc_curve
	 */
	public addArc(to: Point, radiusX: number, radiusY: number, angle: number, useLargeArc: boolean = true, clockwiseTurningArc: boolean = true): this {
		this.addValue<SVGPathArc>(`a${radiusX} ${radiusY} ${angle} ${useLargeArc ? 1 : 0} ${clockwiseTurningArc ? 0 : 1} ${this.pointTransform(to)}`);
		return this
	}
	public closePath(): this { this.value = ' Z'; return this }
	public clear(): this { this.value = 'M0 0'; return this }

	public setViewport(width: number, height: number): this {
		this.viewport = {
			width: width,
			height: height
		};
		return this
	}



	public addRect(width: number, height: number): this {
		const v = this.viewport;
		const transformedWidth = v ? width / v.width : width;
		const transformedHeight = v ? height / v.height : height;
		this.value += ` h${transformedWidth}v${transformedHeight}h-${transformedWidth}v-${transformedHeight}m${transformedWidth} ${transformedHeight}`;
		return this
	}
	public addRoundedRect(width: number, height: number, radiusX: number, radiusY: number): this {
		const v = this.viewport;
		width = width - radiusX * 2;
		height = height - radiusY * 2;
		const transformedWidth = v ? width / v.width : width;
		const transformedHeight = v ? height / v.height : height;
		this.value += ` m${radiusX} 0h${transformedWidth}a${radiusX} ${radiusY} 0 0 1 ${radiusX} ${radiusY}v${transformedHeight}a${radiusX} ${radiusY} 0 0 1 -${radiusX} ${radiusY}h-${transformedWidth}a${radiusX} ${radiusY} 0 0 1 -${radiusX} -${radiusY}v-${transformedHeight}a${radiusX} ${radiusY} 0 0 1 ${radiusX} -${radiusY}m${transformedWidth} ${transformedHeight}`;
		return this
	}
	public elipse(radiusX: number, radiusY?: number): this {
		const v = this.viewport;
		const transformedRadiusX = v ? radiusX / v.width : radiusX;

		let transformedRadiusY: number;
		if (radiusY) transformedRadiusY = v ? radiusY / v.height : radiusY;
		else transformedRadiusY = transformedRadiusX;

		this.value += ` m${transformedRadiusX} 0a${transformedRadiusX} ${transformedRadiusY} 0 1 0 0 ${transformedRadiusY * 2}a ${transformedRadiusX} ${transformedRadiusY} 0 1 0 0 -${transformedRadiusY * 2}m${transformedRadiusX} ${transformedRadiusY * 2}`;
		return this
	}

	public addPath(value: Path | string) { this.value += ' ' + value; }





	public toCanvasPath(): Path2D { return new Path2D(this.value) }
	public toCSSValue(): string { return 'path(' + this.value + ')' }
	public toString(): string { return this.value }




	constructor(svgPath: string) {
		this.value = svgPath
	}
}