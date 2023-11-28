import { Currency } from '../../Currency';
import { Buyer } from './Buyer';
import { InvoiceBuyerProvidedInfo } from './InvoiceBuyerProvidedInfo';
import { InvoiceTransaction } from './InvoiceTransaction';
import { Shopper } from './Shopper';
import { RefundInfo } from './RefundInfo';
import { InvoiceUniversalCodes } from './InvoiceUniversalCodes';
import { BitPayExceptionProvider } from '../../Exceptions/BitPayExceptionProvider';
import { MinerFeesItem } from './MinerFeesItem';
import { SupportedTransactionCurrency } from './SupportedTransactionCurrency';

export interface InvoiceInterface {
  // API fields
  // Required fields

  currency: string;
  guid: string;
  token: string;

  // Optional fields

  price?: number;
  posData?: string;
  notificationURL?: string;
  transactionSpeed?: string;
  fullNotifications?: boolean;
  notificationEmail?: string;
  redirectURL?: string;
  closeURL?: string;
  orderId?: string;
  itemDesc?: string;
  itemCode?: string;
  physical?: boolean;
  paymentCurrencies?: string[];
  acceptanceWindow?: number;
  autoRedirect?: boolean;
  forcedBuyerSelectedWallet?: string;
  forcedBuyerSelectedTransactionCurrency?: string;

  // Buyer data

  buyer?: Buyer;

  // Response fields

  id?: string;
  url?: string;
  status?: string;
  lowFeeDetected?: boolean;
  invoiceTime?: number;
  expirationTime?: number;
  currentTime?: number;
  exceptionStatus?: boolean;
  targetConfirmations?: number;
  transactions?: InvoiceTransaction[];
  refundAddresses?: unknown;
  refundAddressRequestPending?: boolean;
  buyerProvidedEmail?: string;
  buyerProvidedInfo?: InvoiceBuyerProvidedInfo;
  supportedTransactionCurrencies?: Record<string, SupportedTransactionCurrency>;
  minerFees?: Record<string, MinerFeesItem>;
  shopper?: Shopper;
  billId?: string;
  refundInfo?: RefundInfo;
  extendedNotifications?: boolean;
  transactionCurrency?: string;
  amountPaid?: number;
  displayAmountPaid?: string;
  exchangeRates?: Record<string, Record<string, number>>;
  paymentSubtotals?: Record<string, number>;
  paymentTotals?: Record<string, number>;
  paymentDisplayTotals?: Record<string, string>;
  paymentDisplaySubTotals?: Record<string, string>;
  nonPayProPaymentReceived?: boolean;
  jsonPayProRequired?: boolean;
  merchantName?: string;
  bitpayIdRequired?: boolean;
  underpaidAmount?: number;
  overpaidAmount?: number;
  paymentCodes?: Record<string, Record<string, string>>;
  isCancelled?: boolean;
  universalCodes?: InvoiceUniversalCodes;

  setCurrency(_currency?: string): void;
}

export class Invoice implements InvoiceInterface {
  // API fields

  // Required fields

  currency: string;
  guid: string;
  token: string;

  // Optional fields

  price?: number;
  posData?: string;
  notificationURL?: string;
  transactionSpeed?: string;
  fullNotifications?: boolean;
  notificationEmail?: string;
  redirectURL?: string;
  closeURL?: string;
  orderId?: string;
  itemDesc?: string;
  itemCode?: string;
  physical?: boolean;
  paymentCurrencies?: string[];
  acceptanceWindow?: number;
  autoRedirect?: boolean;
  forcedBuyerSelectedWallet?: string;
  forcedBuyerSelectedTransactionCurrency?: string;

  // Buyer data

  buyer?: Buyer;

  // Response fields

  id?: string;
  url?: string;
  status?: string;
  lowFeeDetected?: boolean;
  invoiceTime?: number;
  expirationTime?: number;
  currentTime?: number;
  exceptionStatus?: boolean;
  targetConfirmations?: number;
  transactions?: InvoiceTransaction[];
  refundAddresses?: unknown;
  refundAddressRequestPending?: boolean;
  buyerProvidedEmail?: string;
  buyerProvidedInfo?: InvoiceBuyerProvidedInfo;
  supportedTransactionCurrencies?: Record<string, SupportedTransactionCurrency>;
  minerFees?: Record<string, MinerFeesItem>;
  shopper?: Shopper;
  billId?: string;
  refundInfo?: RefundInfo;
  extendedNotifications?: boolean;
  transactionCurrency?: string;
  amountPaid?: number;
  displayAmountPaid?: string;
  exchangeRates?: Record<string, Record<string, number>>;
  paymentSubtotals?: Record<string, number>;
  paymentTotals?: Record<string, number>;
  paymentDisplayTotals?: Record<string, string>;
  paymentDisplaySubTotals?: Record<string, string>;
  nonPayProPaymentReceived?: boolean;
  jsonPayProRequired?: boolean;
  merchantName?: string;
  bitpayIdRequired?: boolean;
  underpaidAmount?: number;
  overpaidAmount?: number;
  paymentCodes?: Record<string, Record<string, string>>;
  isCancelled?: boolean;
  universalCodes?: InvoiceUniversalCodes;

  /**
   * Constructor, create a minimal request Invoice object.
   *
   * @param price    The amount for which the invoice will be created.
   * @param currency The three digit currency type used to compute the invoice bitcoin amount.
   */
  public constructor(price: number, currency: string) {
    this.price = price;
    this.setCurrency(currency);
  }

  /**
   * Set currency for invoice.
   * @param currency string
   * @throws BitPayGenericException BitPayGenericException class
   */
  setCurrency(currency: string) {
    if (!Currency.isValid(currency)) BitPayExceptionProvider.throwInvalidCurrencyException(currency);

    this.currency = currency;
  }
}
