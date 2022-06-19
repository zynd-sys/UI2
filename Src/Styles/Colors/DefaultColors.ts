import { RGBColor } from './RGBColor'









/** @see https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/ */
export class DefaultColorClass {
	/**
	 * light color rgb(0, 122, 255)
	 *
	 * dark color rgb(10, 132, 255)
	 */
	public readonly blue = new RGBColor(0, 122, 255).darkModeColor(10, 132, 255)
	/**
	 * light color rgb(162, 132, 94)
	 *
	 * dark color rgb(172, 142, 104)
	 */
	public readonly brown = new RGBColor(162, 132, 94).darkModeColor(172, 142, 104)
	/**
	* light color rgb(50, 173, 230)
	*
	* dark color rgb(100, 210, 255)
	*/
	public readonly cyan = new RGBColor(50, 173, 230).darkModeColor(100, 210, 255)
	/**
	 * light color rgb(52, 199, 89)
	 *
	 * dark color rgb(48, 209, 88)
	 */
	public readonly green = new RGBColor(52, 199, 89).darkModeColor(48, 209, 88)
	/**
	 * light color rgb(88, 86, 214)
	 *
	 * dark color rgb(94, 92, 230)
	 */
	public readonly indigo = new RGBColor(88, 86, 214).darkModeColor(94, 92, 230)
	/**
	 * light color rgb(0, 199, 190)
	 *
	 * dark color rgb(102, 212, 207)
	 */
	public readonly mint = new RGBColor(0, 199, 190).darkModeColor(102, 212, 207)
	/**
	 * light color rgb(255, 149, 0)
	 *
	 * dark color rgb(255, 159, 10)
	 */
	public readonly orange = new RGBColor(255, 149, 0).darkModeColor(255, 159, 10)
	/**
	 * light color rgb(255, 45, 85)
	 *
	 * dark color rgb(255, 55, 95)
	 */
	public readonly pink = new RGBColor(255, 45, 85).darkModeColor(255, 55, 95)
	/**
	 * light color rgb(175, 82, 222)
	 *
	 * dark color rgb(191, 90, 242)
	 */
	public readonly purple = new RGBColor(175, 82, 222).darkModeColor(191, 90, 242)
	/**
	 * light color rgb(255, 59, 48)
	 *
	 * dark color rgb(255, 69, 58)
	 */
	public readonly red = new RGBColor(255, 59, 48).darkModeColor(255, 69, 58)
	/**
	 * light color rgb(90, 200, 250)
	 *
	 * dark color rgb(100, 210, 255)
	 */
	public readonly teal = new RGBColor(90, 200, 250).darkModeColor(100, 210, 255)
	/**
	 * light color rgb(255, 204, 0)
	 *
	 * dark color rgb(255, 214, 10)
	 */
	public readonly yellow = new RGBColor(255, 204, 0).darkModeColor(255, 214, 10)





	/**
	 * light color rgb(51, 51, 51)
	 */
	public readonly black = new RGBColor(51, 51, 51)
	/**
	 * light color rgb(255, 255, 255)
	 */
	public readonly white = new RGBColor(255, 255, 255)

	/**
	 * light color rgb(255, 255, 255)
	 *
	 * dark color rgb(0, 0, 0)
	 */
	public readonly backgroundColor = new RGBColor(255, 255, 255).darkModeColor(0, 0, 0)
	/**
	 * light color rgba(0, 0, 0, 0)
	 */
	public readonly transparent = new RGBColor(0, 0, 0, 0)
	/**
	 * light color rgb(0, 0, 0)
	 *
	 * dark color rgb(255, 255, 255)
	 */
	public readonly textColor = new RGBColor(0, 0, 0).darkModeColor(255, 255, 255)





	/**
	 * light color rgb(142, 142, 147)
	 */
	public readonly gray = new RGBColor(142, 142, 147)
	/**
	 * light color rgb(174, 174, 178)
	 *
	 * dark color rgb(99, 99, 102)
	 */
	public readonly gray2 = new RGBColor(174, 174, 178).darkModeColor(99, 99, 102)
	/**
	 * light color rgb(199, 199, 204)
	 *
	 * dark color rgb(72, 72, 74)
	 */
	public readonly gray3 = new RGBColor(199, 199, 204).darkModeColor(72, 72, 74)
	/**
	 * light color rgb(209, 209, 214)
	 *
	 * dark color rgb(58, 58, 60)
	 */
	public readonly gray4 = new RGBColor(209, 209, 214).darkModeColor(58, 58, 60)
	/**
	 * light color rgb(229, 229, 234)
	 *
	 * dark color rgb(44, 44, 46)
	 */
	public readonly gray5 = new RGBColor(229, 229, 234).darkModeColor(44, 44, 46)
	/**
	 * light color rgb(242, 242, 247)
	 *
	 * dark color rgb(28, 28, 30)
	 */
	public readonly gray6 = new RGBColor(242, 242, 247).darkModeColor(28, 28, 30)
}

export const DefaultColor = new DefaultColorClass