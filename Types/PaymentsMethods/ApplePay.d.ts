

/** @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest */
interface ApplePayRequest {
	/**
	 * The merchant identifier you registered with Apple for use with Apple Pay.
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951611-merchantidentifier
	 */
	merchantIdentifier: string;
	/**
	 * The payment capabilities, such as credit or debit, supported by the merchant.
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951835-merchantcapabilities
	 */
	merchantCapabilities: ['supports3DS', ...('supportsEMV' | 'supportsCredit' | 'supportsDebit')[]]
	/**
	 * The payment networks supported by the merchant.
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951831-supportednetworks
	 */
	supportedNetworks: ('amex' | 'cartesBancaires' | 'chinaUnionPay' | 'discover' | 'eftpos' | 'electron' | 'elo' | 'interac' | 'jcb' | 'mada' | 'maestro' | 'masterCard' | 'privateLabel' | 'visa' | 'vPay')[];
	/**
	 * The Apple Pay version supported on your website.
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951604-version
	 */
	version: 5
	/**
	 * code country in ISO 3166
	 * @see https://www.iso.org/obp/ui/#iso:pub:PUB500001:en
	 */
	countryCode: string






	/**
	 * The fields of billing information that you require from the user to process the transaction.
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951830-requiredbillingcontactfields
	 */
	requiredBillingContactFields?: ('name' | 'email' | 'phone' | 'postalAddress' | 'phoneticName')[]
	/**
	 * The customer's billing information.
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951832-billingcontact
	 */
	billingContact?: ApplePayPaymentContact
	/**
	 * The fields of shipping information that you require from the user to fulfill the order.
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/3179519-requiredshippingcontactfields
	 */
	requiredShippingContactFields?: ('name' | 'email' | 'phone' | 'postalAddress' | 'phoneticName')[]
	/**
	 * The customer's shipping information.
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951829-shippingcontact
	 */
	shippingContact?: ApplePayPaymentContact
	/**
	 * sting in Base64
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951834-applicationdata
	 */
	applicationData?: string
	/**
	 * code country in ISO 3166
	 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951836-supportedcountries
	 * @see https://www.iso.org/obp/ui/#iso:pub:PUB500001:en
	 */
	supportedCountries?: string[]
}





/** @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentcontact */
interface ApplePayPaymentContact {
	phoneNumber?: string
	emailAddress?: string
	givenName?: string
	familyName?: string
	phoneticGivenName?: string
	phoneticFamilyName?: string
	addressLines?: string[];
	subLocality?: string
	locality?: string
	postalCode?: string
	subAdministrativeArea?: string
	administrativeArea?: string
	country?: string
	countryCode?: string
}






interface PaymentRequestEventMap {
	'merchantvalidation': MerchantValidationEvent
}

interface MerchantValidationEvent {
	methodName: string
	validationURL: string
	complete: () => Promise<any>
}
