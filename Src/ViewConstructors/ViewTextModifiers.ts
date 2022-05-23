import type { Color } from '../Styles/Colors';
import type { Styles } from './Modifiers/Styles';
import type { TextStyles } from '../Styles/CSS/Types';
import { MainStyleSheet, CSSSelectore, Units, type BorderStyle, type ColumnInsideBreak, type Align, TextWeight, type TextTransform, TextSpacing } from '../Styles/CSS';
import { ViewModifiers } from './ViewModifiers';










MainStyleSheet.add(
	new CSSSelectore('.text-conteainer', {
		'display': 'block',
		'max-inline-size': '100%',
		'overflow': 'hidden',

		'transition-property': 'background-color, border-color, color',

		'user-select': 'none',
		'-webkit-user-select': 'none',

		'font-size': '1rem',
		'font-family': `-apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
		'color': 'inherit',
		'-moz-osx-font-smoothing': 'grayscale',
		/* text-transform: inherit; */

		'overflow-wrap': 'break-word',
		/* -webkit-hyphens: auto;
		hyphens: auto; */
		'text-overflow': 'ellipsis'
	})
)




export abstract class ViewTextModifiers<E extends HTMLElement | { parent: HTMLElement }> extends ViewModifiers<E> {

	protected abstract override styles: Styles<TextStyles>




	// -webkit-line-clamp
	// font-stretch
	// letter-spacing
	// text-transform
	// word-spacing
	// background-clip
	// Text.Case


	public columnMaxCount(value: number): this { this.styles.set('column-count', value); return this }
	public columnWidth(value: number, unit: Units = Units.px): this { this.styles.set('column-width', `${value}${unit}`); return this }
	public columnGap(value: number, unit: Units = Units.px): this { this.styles.set('column-gap', `${value}${unit}`); return this }
	public columnDridwerWidth(value: number, unit: Units = Units.px): this { this.styles.set('column-rule-width', `${value}${unit}`); return this }
	public columnDridwerStyle(value: BorderStyle): this { this.styles.set('column-rule-style', value); return this }
	public columnDridwerColor(value: Color): this { this.styles.set('column-rule-color', value); return this }
	public columnInsideBreak(value: ColumnInsideBreak): this { this.styles.set('break-inside', value); return this }
	public columnBalanceFill(value: boolean = true): this { if (value) this.styles.set('column-fill', 'balance'); return this }
	// column-span



	// public textWordBreak(value)
	public textAlignt(value: Align): this { this.styles.set('text-align', value); return this }
	// /** ⚠️ not supported in Safari */
	// public textAligntLastLine(value: Align): this { this.styles.set('text-align-last', value); return this }
	public textTabSize(value: number): this { this.styles.set('tab-size', value); return this }
	// public textTransform()
	public textIndent(value: number, unit: Units = Units.px): this { this.styles.set('text-indent', `${value}${unit}`); return this }
	public textColor(value?: Color): this { if (value) this.styles.set('color', value); return this }
	public textFontFamily(value: string): this { this.styles.set('font-family', value); return this }
	/**
	 * @param value is a css `rem`
	 *
	 * default `1rem` = `16px`
	 */
	public textSize(value: number): this { this.styles.set('font-size', `${value}rem`); return this }
	public textLetterSpacing(value: number, unit: Units = Units.em): this { this.styles.set('letter-spacing', `${value}${unit}`); return this }
	public textLineHeight(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('line-height', `${value}${unit}`); return this }
	public textWeight(value: TextWeight): this { this.styles.set('font-weight', value); return this }
	public textTransform(value: TextTransform): this { this.styles.set('text-transform', value); return this }
	public textSpacingStyle(value: TextSpacing): this { this.styles.set('white-space', value); return this }

	/**
	 * ⚠ no standart styles
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
	 */
	public lineLimit(value?: number): this {
		if (value) this.styles
			.set('display', '-webkit-box')
			.set('-webkit-box-orient', 'vertical')
			.set('-webkit-line-clamp', value);
		return this
	}
	/** @param value default true */
	public textOverflowEllipsis(value: boolean = true): this { this.styles.set('text-overflow', value ? 'ellipsis' : 'clip'); return this }


	/** @param value default true */
	public oneLine(value: boolean = true): this { if (value) this.styles.set('white-space', TextSpacing.nowrap); return this }
	/** @param value default true */
	public hyphens(value: boolean = true): this { if (value) this.styles.set('hyphens', 'auto').set('-webkit-hyphens', 'auto'); return this }
	/** @param value default true */
	public unwrapWord(value: boolean = true): this { if (value) this.styles.set('overflow-wrap', 'normal'); return this }
	/** @param value default true */
	public underline(value: boolean = true): this { if (value) this.styles.set('text-decoration', 'underline'); return this }
	/** @param value default true */
	public lineThrough(value: boolean = true): this { if (value) this.styles.set('text-decoration', 'line-through'); return this }
	/** @param value default true */
	public italic(value: boolean = true): this { if (value) this.styles.set('font-style', 'italic'); return this }
	/** @param value default true */
	public bold(value: boolean = true): this { if (value) this.styles.set('font-weight', TextWeight.Bold); return this }





	public override update(newRender: ViewTextModifiers<any>): void {
		if (!this.HTMLElement) { this.importProperty(newRender); return }
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;

		if (this.merge) this.merge(newRender, this.HTMLElement);
		this.renderModifiers(element, newRender);
	}

	public override render(withAnimation?: boolean): HTMLElement {
		if (this.HTMLElement) return this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent

		this.HTMLElement = this.generateHTMLElement();
		let element = this.HTMLElement instanceof HTMLElement ? this.HTMLElement : this.HTMLElement.parent;
		element.classList.add('text-conteainer')
		this.renderModifiers(element, undefined, withAnimation);
		return element
	}
}