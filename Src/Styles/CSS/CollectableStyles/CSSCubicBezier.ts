




export type CSSCubicBezierType = `cubic-bezier(${number},${number},${number},${number})`


export class CSSCubicBezier {
	public readonly p1: number
	public readonly p2: number
	public readonly p3: number
	public readonly p4: number

	public toString(): CSSCubicBezierType { return `cubic-bezier(${this.p1},${this.p2},${this.p3},${this.p4})` }

	constructor(point1: number, point2: number, point3: number, point4: number) {
		this.p1 = point1;
		this.p2 = point2;
		this.p3 = point3;
		this.p4 = point4;
	}
}
