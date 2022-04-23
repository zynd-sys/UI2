import { URIBuilder } from './URIBuilder'



export class Email extends URIBuilder {
	protected value: string

	public override toString(): string { return this.value }
	public toURI(): string {return `mailto:${this.value}`}


	constructor(value: string) {
		super()
		this.value = value
	}
}