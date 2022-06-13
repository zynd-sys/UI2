import type { CSSSelectore } from './CSSSelectore';





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
		for (let ruleCustom of values) {
			const rule = this.sheet.cssRules[this.sheet.insertRule(`${ruleCustom.selector} {}`, this.size)]
			if (!(rule instanceof CSSStyleRule)) throw new Error('CSS style rule not created')
			ruleCustom.setCSSRule(rule);
			super.add(ruleCustom);
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
		if (!styleElement.sheet) throw new Error('failed created style sheet')
		this.sheet = styleElement.sheet;

	}
}