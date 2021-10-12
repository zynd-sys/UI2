


export class Point {
	public readonly x: number
	public readonly y: number
	public equalTo(value: Point): boolean { return this.x == value.x && this.y == value.y }
	constructor(x: number, y: number) { this.x = x; this.y = y }
}