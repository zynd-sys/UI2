


export class SideStyle {
	/** ⤒ */ public top: string = '0'
	/** ⤓ */ public bottom: string = '0'
	/** ⇤ */ public left: string = '0'
	/** ⇥ */ public right: string = '0'

	public toString() { return `${this.top} ${this.right} ${this.bottom} ${this.left}`; }
}