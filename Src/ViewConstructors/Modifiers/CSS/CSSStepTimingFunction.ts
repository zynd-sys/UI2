

export type CSSStepTimingFunctionType = `steps(${number})` | `steps(${number},${'jump-start' | 'jump-end' | 'jump-none' | 'jump-both'})`

export class CSSStepTimingFunction {
	protected jumpterm?: 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both'
	protected step: number

	public toString(): CSSStepTimingFunctionType { return this.jumpterm ? `steps(${this.step},${this.jumpterm})` : `steps(${this.step})` }

	public jumpStart(value: boolean): this { if (value) this.jumpterm = 'jump-start'; return this }
	public jumpEnd(value: boolean): this { if (value) this.jumpterm = 'jump-end'; return this }
	public jumpNone(value: boolean): this { if (value) this.jumpterm = 'jump-none'; return this }
	public jumpBoth(value: boolean): this { if (value) this.jumpterm = 'jump-both'; return this }

	constructor(value: number) {
		this.step = value;
	}
}