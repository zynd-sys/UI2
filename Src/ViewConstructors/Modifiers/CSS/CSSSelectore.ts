import { StylesInterface } from "./Types/StylesInterface";







export class CSSSelectore<I extends StylesInterface> extends Map<keyof I, I[keyof I]> {
	public readonly selector: string

	protected CSSRule?: CSSStyleRule

	protected clearCSSRule(rule: CSSStyleRule) {
		let styles = rule.style
		for (let i = 0; i < styles.length; i++) {
			styles.removeProperty(styles.item(i));
			i--
		}
	}

	public override clear(): void {
		if (this.CSSRule) this.clearCSSRule(this.CSSRule)
		super.clear();
	}
	public override delete(key: keyof I): boolean {
		this.CSSRule?.style.removeProperty(key as string);
		return super.delete(key)
	}
	public override set<P extends keyof I>(key: P, value: I[P]): this {
		this.CSSRule?.style.setProperty(key as string, String(value));
		super.set(key, value);
		return this
	}





	public setCSSRule(rule: CSSStyleRule): this {
		rule.selectorText = this.selector;
		this.clearCSSRule(rule);
		this.forEach((value, key) => rule.style.setProperty(key as string, String(value)));
		this.CSSRule = rule;
		return this
	}
	public deleteCSSRule(): this { this.CSSRule = undefined; return this }


	constructor(selectore: string, values?: { [key in keyof I]: I[key] }) {
		super();
		this.selector = selectore;
		if (values) for (let p in values) this.set(p, values[p])
	}
}