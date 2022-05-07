import type { ButtonActionInterface } from '../Button'
import type { Styles } from '../../ViewConstructors/Modifiers/Styles';
import type { ButtonActionStyles } from '../../Styles/CSS/Types';
import { TimingFunction } from '../../Styles/CSS';





/** @see https://www.w3.org/Payments/card-network-ids */
export enum CardNetwork {
	amex = 'amex',
	cartebancaire = 'cartebancaire',
	diners = 'diners',
	discover = 'discover',
	jcb = 'jcb',
	mastercard = 'mastercard',
	mir = 'mir',
	paypak = 'paypak',
	troy = 'troy',
	unionpay = 'unionpay',
	visa = 'visa'
}
const AllCardNetworks: readonly CardNetwork[] = Object.keys(CardNetwork) as CardNetwork[];
const GooglePayAllowCardNetworks: readonly CardNetwork[] = [
	CardNetwork.amex,
	CardNetwork.discover,
	CardNetwork.jcb,
	CardNetwork.mastercard,
	CardNetwork.visa
];

export interface MerchantValidationEvent {
	methodName: string
	validationURL: string
	complete: () => Promise<any>
}








class ButtonInterface implements ButtonActionInterface {
	protected disableValue?: boolean
	protected ApplePayButtonValue?: boolean
	protected handler: () => void

	public onClick(): void { if (!this.disableValue) this.handler() }
	public elements() { if (this.ApplePayButtonValue) return [] }
	public styles(styles: Styles<ButtonActionStyles>) {
		styles
			.set('opacity', this.disableValue ? .5 : 1)
			.set('transition-duration', '.6s')
			.set('transition-property', 'all')
			.set('transition-timing-function', TimingFunction.easeInOut);

		if (this.ApplePayButtonValue) styles
			.set('-webkit-appearance', '-apple-pay-button')
			.set('appearance', '-apple-pay-button')
	}

	public disable(value?: boolean): this { this.disableValue = value; return this }
	public isApplePayButton(value?: boolean): void { this.ApplePayButtonValue = value }

	constructor(handler: () => void) {
		this.handler = handler;
	}
}










class PaymentDataClass {

	protected paymentMethodData: Map<string, PaymentMethodData> = new Map()

	/** @see https://developer.mozilla.org/en-US/docs/Web/API/BasicCardRequest/supportedNetworks */
	protected cardNetworks: Set<CardNetwork>
	protected currency: string
	protected button: ButtonInterface = new ButtonInterface(() => this.render());

	protected totalLabel: string = ''
	protected items?: () => ({ price: number, label: string }[] | number)
	protected requestValidate: (data: PaymentResponse, complete: boolean) => Promise<PaymentValidationErrors | void | 'fail'>
	protected MerchantValidationHandler?: (event: MerchantValidationEvent) => Promise<void>







	public GooglePay(merchantIdentifier: string, gatewayMerchant: { gateway: string, gatewayMerchantId: string }, merchantName?: string, allowCreditCards: boolean = true, allowedAuthMethods?: ('PAN_ONLY' | 'CRYPTOGRAM_3DS')[]): this {
		let PaymentMethods = [];
		for (let item of this.cardNetworks) if (GooglePayAllowCardNetworks.includes(item)) PaymentMethods.push(item.toUpperCase());

		let data: GooglePayRequest = {
			apiVersion: 2,
			apiVersionMinor: 0,
			merchantInfo: {
				merchantId: merchantIdentifier,
				merchantName: merchantName
			},
			allowedPaymentMethods: [{
				type: 'CARD',
				parameters: {
					allowCreditCards: allowCreditCards,
					allowedAuthMethods: allowedAuthMethods || ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
					allowedCardNetworks: PaymentMethods as any[]
				},
				tokenizationSpecification: {
					type: 'DIRECT',
					parameters: gatewayMerchant
				}
			}],
			transactionInfo: {
				currencyCode: '',
				totalPriceStatus: 'FINAL'
			}
		}
		this.paymentMethodData.set('GooglePay', {
			supportedMethods: 'https://google.com/pay',
			data: data
		});
		return this
	}
	/** @see https://webkit.org/blog/8182/introducing-the-payment-request-api-for-apple-pay/ */
	public ApplePay(merchantId: string, countryCode: string, merchantCapabilities: ('supportsEMV' | 'supportsCredit' | 'supportsDebit')[], MerchantValidation: (event: MerchantValidationEvent) => Promise<void>): this {
		if (!('ApplePaySession' in window)) return this

		this.MerchantValidationHandler = MerchantValidation;
		this.button.isApplePayButton(true)
		let capabilities: ['supports3DS', ...('supportsEMV' | 'supportsCredit' | 'supportsDebit')[]] = ['supports3DS'];
		if (merchantCapabilities.length != 0) capabilities.concat(merchantCapabilities);
		else capabilities.push('supportsEMV', 'supportsCredit', 'supportsDebit');

		let data: ApplePayRequest = {
			version: 5,
			merchantIdentifier: merchantId,
			merchantCapabilities: capabilities,
			supportedNetworks: Array.from(this.cardNetworks) as any[],
			countryCode: countryCode
		}
		this.paymentMethodData.set('ApplePay', {
			supportedMethods: 'https://apple.com/apple-pay',
			data: data
		})
		return this
	}

	public totalTypeLabel(value: string): this { this.totalLabel = value; return this }
	public buttonInterface(items: () => ({ price: number, label: string }[] | number)): ButtonInterface { this.items = items; return this.button }








	protected async render() {
		if (!this.items) throw new Error('not found items')


		let total: number = 0;
		let displayItems: PaymentItem[] | undefined;
		const items = this.items();
		if (typeof items == 'number') total = items
		else displayItems = items.map(v => {
			total += v.price;
			return {
				label: v.label,
				amount: {
					currency: this.currency,
					value: v.price.toString()
				}
			}
		});



		let request = new window.PaymentRequest(
			Array.from(this.paymentMethodData.values()),
			{
				total: { label: this.totalLabel, amount: { value: total.toString(), currency: this.currency } },
				displayItems: displayItems
			}
		);
		if (this.MerchantValidationHandler) request.addEventListener('merchantvalidation', this.MerchantValidationHandler)

		await request.canMakePayment();

		let response = await request.show();

		if (this.requestValidate) while (true) {
			let errors = await this.requestValidate(response, false)
			if (errors == 'fail') return await response.complete('fail')
			if (errors) await response.retry(errors)
			else break
		}
		await response.complete();
		await this.requestValidate(response, true);

		return
	}





	constructor(currency: string, cardNetworks: (CardNetwork[] | typeof CardNetwork), onData: (data: PaymentResponse, complete: boolean) => Promise<void | 'fail' | PaymentValidationErrors>) {
		this.currency = currency;
		this.requestValidate = onData;
		this.cardNetworks = new Set(Array.isArray(cardNetworks) ? cardNetworks : AllCardNetworks);

		this.paymentMethodData
			.set('BasicCard', {
				supportedMethods: 'basic-card', data: { supportedNetworks: Array.from(this.cardNetworks) }
			});
	}
}




export type PaymentDataInterface = PaymentDataClass
export const PaymentData: typeof PaymentDataClass | undefined = window.PaymentRequest ? PaymentDataClass : undefined