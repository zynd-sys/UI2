export class CubicBezier {
	protected p1: number
	protected p2: number
	protected p3: number
	protected p4: number

	public toString() { return `cubic-bezier(${this.p1},${this.p2},${this.p3},${this.p4})` }

	constructor(point1: number, point2: number, point3: number, point4: number) {
		this.p1 = point1;
		this.p2 = point2;
		this.p3 = point3;
		this.p4 = point4;
	}
}
