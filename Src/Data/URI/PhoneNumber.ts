import { URIBuilder } from './URIBuilder';



export class PhoneNumber extends URIBuilder {

	protected value: string

	public override toString(): string { return this.value }
	public toURI(): string {return `tel:${this.value}`}
	/**
	 * extends this class and modifies toLocaleString to correctly display the phone number in `Texts`
	 * @example new PhoneNumbers(0, 123_456_7890) // tel:1234567890
	 * @example new PhoneNumbers(1, 123_456_7890) // tel:+11234567890
	 */
	constructor(trunkPrefix: number = 0, value: number) {
		super()
		let str = '';
		if (trunkPrefix) str += `+${trunkPrefix}`;
		this.value = str + value.toString();
	}
}