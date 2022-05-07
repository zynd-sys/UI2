import { TransformsStyle, TransformStyleInterface } from "../../Styles/CSS/CollectableStyles/TransformsStyle";




export class TransformsStylesRef extends TransformsStyle {
	protected HTMLElement?: HTMLElement

	public render(value: HTMLElement): void { this.HTMLElement = value }
	public destroy(): void { this.HTMLElement = undefined }

	public override set<P extends keyof TransformStyleInterface>(key: P, value?: TransformStyleInterface[P]): this {
		super.set(key, value)
		this.HTMLElement?.style.setProperty('transform', this.toString());
		return this
	}
}