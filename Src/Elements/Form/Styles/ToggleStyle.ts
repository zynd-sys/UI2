import { Color, DefaultColor, hex } from "Colors";
import { ContentAlign } from "Enum/ContentAlign";
import { Side } from "Enum/Side";
import { SideBorderRadius } from "Enum/SideBorderRadius";
import { TimingFunction } from "Enum/TimingFunction";
import { Units } from "Enum/Units";
import { Picture } from "../../Picture";
import { SpanView, Span } from "../Span";











export type ToggleStyleInterface = (accentColor: Color, isOn: boolean) => SpanView



const borderColor = hex('#e7e7e7');
const shadowColor = hex('#000', .3);





export const ToggleStyle = new class ToggleStyle {
	[key: string]: ToggleStyleInterface


	public Switch(accentColor: Color, isOn: boolean) {
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
					.backgroundColor(DefaultColor.backgroundColor)
					.borderRadius(SideBorderRadius.all, 50, Units.absolute)
			)
	}


	public Checkbox(accentColor: Color, isOn: boolean): SpanView {
		return Span()
			.transition(300, TimingFunction.easeInOut)
			.height(1.25, Units.rem).width(1.25, Units.rem)
			.margin(Side.right, .5, Units.rem).margin(Side.topBottom, .5, Units.rem)
			.borderWidth(Side.all, .125, Units.rem).borderStyle().borderColor(isOn ? accentColor : borderColor)
			.borderRadius(SideBorderRadius.all, .125, Units.rem)
			.backgroundColor(isOn ? accentColor : DefaultColor.backgroundColor)
			.elements(
				Picture('data:image/svg+xml,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white"/></svg>', '')
					.height(.75, Units.rem).width(.75, Units.rem)
			)
	}

	public Radio(accentColor: Color, isOn: boolean): SpanView {
		return Span()
			.transition(300, TimingFunction.easeInOut)
			.height(1.25, Units.rem).width(1.25, Units.rem)
			.margin(Side.right, .5, Units.rem).margin(Side.topBottom, .5, Units.rem)
			.borderWidth(Side.all, .125, Units.rem).borderStyle().borderColor(isOn ? accentColor : borderColor)
			.borderRadius(SideBorderRadius.all, 50, Units.absolute)
			.backgroundColor(isOn ? accentColor : DefaultColor.backgroundColor)
			.elements(
				Span()
					.backgroundColor(DefaultColor.backgroundColor)
					.height(.75, Units.rem).width(.75, Units.rem)
					.borderRadius(SideBorderRadius.all, 50, Units.absolute)
			)
	}
}