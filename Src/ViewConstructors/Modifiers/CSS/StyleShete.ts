import type { CSSSelectore } from "./CSSSelectore";





export class StyleSheetCustom extends Set<CSSSelectore<any>> {
	protected sheet: CSSStyleSheet

	protected deleteCSSRule(value: string): boolean {
		for (let i = 0; i < this.sheet.cssRules.length; i++) {
			let rule = this.sheet.cssRules[i];
			if (rule instanceof CSSStyleRule && rule.selectorText == value) {
				this.sheet.deleteRule(i);
				return true
			}
		}
		return false
	}





	public override add(...values: CSSSelectore<any>[]): this {
		for (let rule of values) {
			let index = this.sheet.insertRule('s {}',this.size);
			rule.setCSSRule(this.sheet.cssRules[index] as CSSStyleRule);
			super.add(rule);
		}
		return this
	}
	public override clear(): void {
		for (let i = 0; i < this.sheet.cssRules.length; i++) this.sheet.deleteRule(i);
		super.clear()
	}
	public override delete(value: CSSSelectore<any>): boolean {
		const selector = value.selector;
		value.deleteCSSRule();
		return super.delete(value) && this.deleteCSSRule(selector)
	}
	public deleteSelector(value: string): boolean {
		let rule: CSSSelectore<any> | undefined;
		for (let r of this) if (r.selector == value) { rule = r; break }
		rule?.deleteCSSRule();
		return (rule ? true : false) && this.deleteCSSRule(value)
	}


	constructor() {
		super();
		let styleElement = document.createElement('style');
		document.head.appendChild(styleElement);
		this.sheet = styleElement.sheet!;

	}
}