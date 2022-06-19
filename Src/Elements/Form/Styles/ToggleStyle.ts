import type { Color } from '../../../Styles/Colors';
import { ContentAlign } from '../../../Styles/CSS/Enums/ContentAlign';
import { Side } from '../../../ViewConstructors/Enum/Side';
import { SideBorderRadius } from '../../../ViewConstructors/Enum/SideBorderRadius';
import { TimingFunction } from '../../../Styles/CSS/Enums/TimingFunction';
import { Units } from '../../../Styles/CSS/Enums/Units';
import { DefaultColor } from '../../../Styles/Colors/DefaultColors';
import { hex } from '../../../Styles/Colors/HEXColor';
import { SpanView, Span } from '../Span';
import { Path } from '../../Shapes/Path';
import { Shape } from '../../Shapes/Shape';











export type ToggleStyleInterface = (accentColor: Color, isOn: boolean) => SpanView



const borderColor = hex('#e7e7e7');
const shadowColor = hex('#000', .3);

const path = new Path('M9.55 18 3.85 12.3 5.275 10.875 9.55 15.15 18.725 5.975 20.15 7.4Z');





export function Switch(accentColor: Color, isOn: boolean) {
	return Span()
		.transition(300, TimingFunction.easeInOut)
		.height(1.25, Units.rem).width(2, Units.rem)
		.margin(Side.right, .5, Units.rem).margin(Side.topBottom, .5, Units.rem)
		.borderRadius(SideBorderRadius.all, 1, Units.rem)
		.backgroundColor(isOn ? accentColor : DefaultColor.gray6)
		.justifyContent(ContentAlign.start)
		.elements(
			Span()
				.transition(300, TimingFunction.easeInOut)
				.translateXEffect(isOn ? .875 : .125, Units.rem)
				.width(1, Units.rem).height(1, Units.rem)
				.dropShadowOffsetX(.125, Units.rem).dropShadowOffsetY(.125, Units.rem).dropShadowBlurRadius(.125, Units.rem).dropShadowColor(shadowColor)
				.backgroundColor(DefaultColor.white)
				.borderRadius(SideBorderRadius.all, 50, Units.absolute)
		)
}


export function Checkbox(accentColor: Color, isOn: boolean): SpanView {
	return Span()
		.transition(300, TimingFunction.easeInOut)
		.height(1.25, Units.rem).width(1.25, Units.rem)
		.margin(Side.right, .5, Units.rem).margin(Side.topBottom, .5, Units.rem)
		.borderWidth(Side.all, .125, Units.rem).borderStyle().borderColor(isOn ? accentColor : borderColor)
		.borderRadius(SideBorderRadius.all, .125, Units.rem)
		.backgroundColor(isOn ? accentColor : DefaultColor.backgroundColor)
		.elements(
			Shape(path)
				.shpaeBox(24, 24, 0, 0)
				.fill(DefaultColor.white)
				.height(100, Units.absolute).width(100, Units.absolute)
		)
}

export function Radio(accentColor: Color, isOn: boolean): SpanView {
	return Span()
		.transition(300, TimingFunction.easeInOut)
		.height(1.25, Units.rem).width(1.25, Units.rem)
		.margin(Side.right, .5, Units.rem).margin(Side.topBottom, .5, Units.rem)
		.borderWidth(Side.all, .125, Units.rem).borderStyle().borderColor(isOn ? accentColor : borderColor)
		.borderRadius(SideBorderRadius.all, 50, Units.absolute)
		.backgroundColor(isOn ? accentColor : DefaultColor.backgroundColor)
		.elements(
			Span()
				.backgroundColor(DefaultColor.white)
				.height(.75, Units.rem).width(.75, Units.rem)
				.borderRadius(SideBorderRadius.all, 50, Units.absolute)
		)
}

