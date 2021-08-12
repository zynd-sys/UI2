import type { Align } from "./Enum/Align";
import type { TextTransform } from "./Enum/TextTransform";
import type { Styles, StylesInterface } from "./Styles/Styles";
import type { Color } from "./Styles/Colors/Colors";
import { TextWeight } from "./Enum/TextWeight";
import { TextSpacing } from "./Enum/TextSpacing";
import { Units } from "./Enum/Units";
import { ViewModifiers } from "./ViewModifiers";




export interface TextStyles extends StylesInterface {
	'text-align'?: Align
	'tab-size'?: number
	// 'text-transform':
	'text-indent'?: string
	'text-align-last'?: Align
	'font-family'?: string
	'color'?: Color
	'font-size'?: string
	'text-decoration'?: 'line-through' | 'underline'
	'font-weight'?: TextWeight
	'font-style'?: 'italic' | 'normal'
	'white-space'?: TextSpacing
	'letter-spacing'?: string
	'text-transform'?: TextTransform
	'line-height'?: string
	// 'word-break'?: 'normal' | 'break-all' | 'keep-all'
	'overflow-wrap'?: 'normal' | 'anywhere' | 'break-word'
	'text-overflow'?: 'clip' | 'ellipsis'
	'hyphens'?: 'none' | 'manual' | 'auto'
	'-webkit-hyphens'?: 'none' | 'manual' | 'auto'
	'-webkit-line-clamp'?: number
	'dispaly'?: '-webkit-box'
	'-webkit-box-orient'?: 'vertical'
}







export abstract class ViewTextModifiers extends ViewModifiers {

	protected abstract styles: Styles<TextStyles>


	protected renderModifiers(element: HTMLElement, newRender?: ViewTextModifiers, withAnimatiom?: boolean): void {
		if (!element.isConnected) element.classList.add('text-conteainer')
		return super.renderModifiers(element, newRender, withAnimatiom);
	}


	// -webkit-line-clamp
	// column
	// font-stretch
	// letter-spacing
	// text-transform
	// word-spacing
	// background-clip
	// Text.Case



	// public textWordBreak(value)
	public textAlignt(value: Align): this { this.styles.set('text-align', value); return this }
	// /** ⚠️ not supported in Safari */
	// public textAligntLastLine(value: Align): this { this.styles.set('text-align-last', value); return this }
	public textTabSize(value: number): this { this.styles.set('tab-size', value); return this }
	// public textTransform()
	public textIndent(value: number, unit: Units = Units.px): this { this.styles.set('text-indent', String(value) + unit); return this }
	public textColor(value?: Color): this { if (value) this.styles.set('color', value); return this }
	public textFontFamily(value: string): this { this.styles.set('font-family', value); return this }
	public textSize(value: number, unit: Units = Units.px): this { this.styles.set('font-size', String(value) + unit); return this }
	public textLetterSpacing(value: number, unit: Units = Units.em): this { this.styles.set('letter-spacing', String(value) + unit); return this }
	public textLineHeight(value?: number, unit: Units = Units.px): this { if (value) this.styles.set('line-height', String(value) + unit); return this }
	public textWeight(value: TextWeight): this { this.styles.set('font-weight', value); return this }
	public textTransform(value: TextTransform): this { this.styles.set('text-transform', value); return this }
	public textSpacingStyle(value: TextSpacing): this { this.styles.set('white-space', value); return this }

	/** 
	 * ⚠ no standart styles
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
	 */
	public lineLimit(value?: number): this {
		if (value) this.styles
			.set('dispaly', '-webkit-box')
			.set('-webkit-box-orient', 'vertical')
			.set('-webkit-line-clamp', value);
		return this
	}
	/** @param value defualt true */
	public textOverflowEllipsis(value: boolean = true): this { this.styles.set('text-overflow', value ? 'ellipsis' : 'clip'); return this }


	/** @param value defualt true */
	public oneLine(value: boolean = true): this { if (value) this.styles.set('white-space', TextSpacing.nowrap); return this }
	/** @param value defualt true */
	public hyphens(value: boolean = true): this { if (value) this.styles.set('overflow-wrap', 'normal').set('hyphens', 'auto').set('-webkit-hyphens', 'auto'); return this }
	/** @param value defualt true */
	public underline(value: boolean = true): this { if (value) this.styles.set('text-decoration', 'underline'); return this }
	/** @param value defualt true */
	public lineThrough(value: boolean = true): this { if (value) this.styles.set('text-decoration', 'line-through'); return this }
	/** @param value defualt true */
	public italic(value: boolean = true): this { if (value) this.styles.set('font-style', 'italic'); return this }
	/** @param value defualt true */
	public bold(value: boolean = true): this { if (value) this.styles.set('font-weight', TextWeight.Bold); return this }
}