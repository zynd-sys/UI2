




/** @see https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest */
interface GooglePayRequest {
	/** Major API version. The value is 2 for this specification.  */
	apiVersion: number
	/** Minor API version. The value is 0 for this specification. */
	apiVersionMinor: number
	/** Information about the merchant that requests payment data. */
	merchantInfo: MerchantInfo
	/** Specifies support for one or more payment methods supported by the Google Pay API. */
	allowedPaymentMethods: PaymentMethodCard[]
	/** Details about the authorization of the transaction based upon whether the user agrees to the transaction or not.Includes total price and price status. */
	transactionInfo: TransactionInfo
	/** Specifies the following callback intents for PaymentDataCallbacks */
	callbackIntents?: ('OFFER' | 'PAYMENT_AUTHORIZATION' | 'SHIPPING_ADDRESS' | 'SHIPPING_OPTION')[]


	/** Fills the payment sheet with any offers initially active for the transaction. */
	offerInfo?: OfferDetail[]
	/** Set to true to request an email address. */
	emailRequired?: boolean
	/** Set to true to request a full shipping address. */
	shippingAddressRequired?: boolean
	/** If shippingAddressRequired is set to true, specify shipping address restrictions. */
	shippingAddressParameters?: ShippingAddressParameters
	/** Set to true when the SHIPPING_OPTION callback intent is used.This field is required if you implement support for Authorize Payments or Dynamic Price Updates.For details, see ShippingOptionParameters. */
	shippingOptionRequired?: boolean
	/** Set default options. */
	shippingOptionParameters?: ShippingOptionParameters[]
}





interface OfferDetail {
	redemptionCode: string
	description: string
}
/** @see https://developers.google.com/pay/api/web/reference/request-objects#ShippingAddressParameters */
interface ShippingAddressParameters {
	/** ISO 3166-1 alpha-2 */
	allowedCountryCodes?: string[]
	phoneNumberRequired?: boolean
}

/** @see https://developers.google.com/pay/api/web/reference/request-objects#ShippingOptionParameters */
interface ShippingOptionParameters {
	shippingOptions: ShippingSelectionOption
	defaultSelectedOptionId?: string
}
/** @see https://developers.google.com/pay/api/web/reference/request-objects#SelectionOption */
interface ShippingSelectionOption {
	id: string
	label: string
	description?: string
}


/** @see https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo */
interface TransactionInfo {
	/** ISO 4217 */
	currencyCode: string
	totalPriceStatus: 'NOT_CURRENTLY_KNOWN' | 'ESTIMATED' | 'FINAL'
	/**
	 * Total monetary value of the transaction with an optional decimal precision of two decimal places. This field is required unless totalPriceStatus is set to NOT_CURRENTLY_KNOWN
	 * format ^[0-9]+(\.[0-9][0-9])?$
	 * @example totalPrice: 12.34
	 * @example totalPrice: 12
	 */
	totalPrice?: string
	/** ISO 3166-1 alpha-2 */
	countryCode?: string
	transactionId?: string
	displayItems?: DisplayItem[]
	totalPriceLabel?: string
	/**
	 * Affects the submit button text displayed in the Google Pay payment sheet.
	 * * DEFAULT: Standard text applies for the given totalPriceStatus (default).
	 * * COMPLETE_IMMEDIATE_PURCHASE: The selected payment method is charged immediately after the payer confirms their selections. This option is only available when totalPriceStatus is set to FINAL.
	 */
	checkoutOption?: 'DEFAULT' | 'COMPLETE_IMMEDIATE_PURCHASE'
}


/** @see https://developers.google.com/pay/api/web/reference/request-objects#MerchantInfo */
interface MerchantInfo {
	merchantId: string
	merchantName?: string
}

/** @see https://developers.google.com/pay/api/web/reference/response-objects#DisplayItem */
interface DisplayItem {
	label: string
	type: 'LINE_ITEM'|'SUBTOTAL'
	price: string
	/** Default to FINAL if not provided */
	status?: 'FINAL' | 'PENDING'
}

// /** @see https://developers.google.com/pay/api/web/reference/request-objects#PaymentMethod */
// interface PaymentMethodPayPal {
// 	type: 'PAYPAL'
// 	parameters: PayPalParameters
// 	tokenizationSpecification?: PaymentMethodTokenizationSpecification
// }
// /** @see https://developers.google.com/pay/api/web/reference/request-objects#PayPalParameters */
// interface PayPalParameters{
// 	purchase_context:
// }
/** @see https://developers.google.com/pay/api/web/reference/request-objects#PaymentMethod */
interface PaymentMethodCard {
	type: 'CARD'
	parameters: CardParameters
	tokenizationSpecification: PaymentMethodTokenizationSpecification
}
/** @see https://developers.google.com/pay/api/web/reference/request-objects#CardParameters */
interface CardParameters {
	allowedAuthMethods: string[]
	allowedCardNetworks: ('AMEX' | 'DISCOVER' | 'INTERAC' | 'JCB' | 'MASTERCARD' | 'VISA')[]
	allowPrepaidCards?: boolean
	allowCreditCards?: boolean
	assuranceDetailsRequired?: boolean
	billingAddressRequired?: boolean
	billingAddressParameters?: BillingAddressParameters
}
/** @see https://developers.google.com/pay/api/web/reference/request-objects#BillingAddressParameters */
interface BillingAddressParameters {
	format?: 'MIN' | 'FULL'
	phoneNumberRequired?: boolean
}





/** @see https://developers.google.com/pay/api/web/reference/request-objects#PaymentMethodTokenizationSpecification */
interface PaymentMethodTokenizationSpecification {
	/** A payment method tokenization type is supported for the given PaymentMethod. For CARD payment method, use PAYMENT_GATEWAY or DIRECT. For PAYPAL PaymentMethod, use DIRECT with no parameter. */
	type: 'PAYMENT_GATEWAY' | 'DIRECT'
	/** Parameters specific to the selected payment method tokenization type. */
	parameters: gatewayMerchant | undefined
}
interface gatewayMerchant {
	gateway: string
	gatewayMerchantId: string
}