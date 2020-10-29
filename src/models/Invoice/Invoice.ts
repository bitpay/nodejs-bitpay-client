
import {Currency} from "../../Currency";
import BitPayException from "../../exceptions/BitPayException";
import {Buyer} from "./Buyer";
import {InvoiceBuyerProvidedInfo} from "./InvoiceBuyerProvidedInfo";
import {InvoiceTransaction} from "./InvoiceTransaction";
import {MinerFees} from "./MinerFees";
import {Shopper} from "./Shopper";
import {RefundInfo} from "./RefundInfo";
import {SupportedTransactionCurrencies} from "./SupportedTransactionCurrencies";

export interface InvoiceInterface {

    currency: string | null;
    guid: string | null;
    token: string | null;
    price: number | null;
    posData: string | null;
    notificationURL: string | null;
    transactionSpeed: string | null;
    fullNotifications: boolean | null;
    notificationEmail: string | null;
    redirectURL: string | null;
    orderId: string | null;
    itemDesc: string | null;
    itemCode: string | null;
    physical: boolean | null;
    paymentCurrencies: Array<string> | null;
    acceptanceWindow: number | null;
    buyer: Buyer | null;
    id: string | null;
    url: string | null;
    status: string | null;
    lowFeeDetected: boolean | null;
    invoiceTime: number | null;
    expirationTime: number | null;
    currentTime: number | null;
    exceptionStatus: string | null;
    targetConfirmations: number | null;
    transactions: InvoiceTransaction | null;
    refundAddresses: any | null;
    refundAddressRequestPending: boolean | null;
    buyerProvidedEmail: string | null;
    invoiceBuyerProvidedInfo: InvoiceBuyerProvidedInfo;
    supportedTransactionCurrencies: SupportedTransactionCurrencies | null;
    minerFees: MinerFees | null;
    shopper: Shopper | null;
    billId: string | null;
    refundInfo: RefundInfo | null;
    extendedNotifications: boolean | null;
    transactionCurrency: string | null;
    amountPaid: number | null;
    exchangeRates: Array<[string, Array<[string, number]>]> | null;
}

export class Invoice implements InvoiceInterface{

    transactions: InvoiceTransaction | null;
    acceptanceWindow: number | null;
    amountPaid: number | null;
    billId: string | null;
    buyer: Buyer | null;
    buyerProvidedEmail: string | null;
    currency: string | null;
    currentTime: number | null;
    exceptionStatus: string | null;
    exchangeRates: Array<[string, Array<[string, number]>]> | null;
    expirationTime: number | null;
    extendedNotifications: boolean | null;
    fullNotifications: boolean | null;
    guid: string | null;
    id: string | null;
    invoiceBuyerProvidedInfo: InvoiceBuyerProvidedInfo;
    invoiceTime: number | null;
    itemCode: string | null;
    itemDesc: string | null;
    lowFeeDetected: boolean | null;
    minerFees: MinerFees | null;
    notificationEmail: string | null;
    notificationURL: string | null;
    orderId: string | null;
    paymentCurrencies: Array<string> | null;
    physical: boolean | null;
    posData: string | null;
    price: number | null;
    redirectURL: string | null;
    refundAddressRequestPending: boolean | null;
    refundAddresses: any | null;
    refundInfo: RefundInfo | null;
    shopper: Shopper | null;
    status: string | null;
    supportedTransactionCurrencies: SupportedTransactionCurrencies | null;
    targetConfirmations: number | null;
    token: string | null;
    transactionCurrency: string | null;
    transactionSpeed: string | null;
    url: string | null;

    /**
     * Constructor, create a minimal request Invoice object.
     *
     * @param price    The amount for which the invoice will be created.
     * @param currency The three digit currency type used to compute the invoice bitcoin amount.
     */
    public constructor(price:number, currency:string) {
        this.price = price;
        this.setCurrency(currency);
    }

    setCurrency(_currency:string) {
        if (!Currency.isValid(_currency))
            throw new BitPayException(null, "Error: currency code must be a type of Model.Currency", null);

        this.currency = _currency;
    }
}
