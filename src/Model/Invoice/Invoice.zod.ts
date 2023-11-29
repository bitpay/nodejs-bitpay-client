import { z } from 'zod';
import { buyerInterfaceSchema } from './Buyer.zod';
import { invoiceTransactionSchema } from './InvoiceTransaction.zod';
import { invoiceBuyerProvidedInfoSchema } from './InvoiceBuyerProvidedInfo.zod';
import { invoiceUniversalCodesSchema } from './InvoiceUniversalCodes.zod';
import { refundInfoSchema } from './RefundInfo.zod';
import { shopperSchema } from './Shopper.zod';
import { minerFeesItemSchema } from './MinerFeesItem.zod';
import { supportedTransactionCurrencySchema } from './SupportedTransactionCurrency.zod';

export const invoiceSchema = z.object({
  buyer: buyerInterfaceSchema.optional(),
  transactions: invoiceTransactionSchema.array().optional(),
  buyerProvidedInfo: invoiceBuyerProvidedInfoSchema.optional(),
  supportedTransactionCurrencies: z.record(z.string(), supportedTransactionCurrencySchema).optional(),
  minerFees: z.record(z.string(), minerFeesItemSchema).optional(),
  shopper: shopperSchema.optional(),
  refundInfo: refundInfoSchema.optional(),
  universalCodes: invoiceUniversalCodesSchema.optional(),

  currency: z.string().optional(),
  guid: z.string().optional(),
  token: z.string().optional(),
  price: z.number().optional(),
  posData: z.string().optional(),
  notificationURL: z.string().optional(),
  transactionSpeed: z.string().optional(),
  fullNotifications: z.boolean().optional(),
  notificationEmail: z.string().optional(),
  redirectURL: z.string().optional(),
  closeURL: z.string().optional(),
  orderId: z.string().optional(),
  itemDesc: z.string().optional(),
  itemCode: z.string().optional(),
  physical: z.boolean().optional(),
  paymentCurrencies: z.array(z.string()).optional(),
  acceptanceWindow: z.number().optional(),
  autoRedirect: z.boolean().optional(),
  forcedBuyerSelectedWallet: z.string().optional(),
  forcedBuyerSelectedTransactionCurrency: z.string().optional(),
  id: z.string().optional(),
  url: z.string().optional(),
  status: z.string().optional(),
  lowFeeDetected: z.boolean().optional(),
  invoiceTime: z.number().optional(),
  expirationTime: z.number().optional(),
  currentTime: z.number().optional(),
  exceptionStatus: z.union([z.boolean(), z.string()]).optional(),
  targetConfirmations: z.number().optional(),
  refundAddresses: z.unknown().optional(),
  refundAddressRequestPending: z.boolean().optional(),
  buyerProvidedEmail: z.string().optional(),
  billId: z.string().optional(),
  extendedNotifications: z.boolean().optional(),
  transactionCurrency: z.string().optional(),
  amountPaid: z.number().optional(),
  displayAmountPaid: z.string().optional(),
  exchangeRates: z.record(z.record(z.number())).nullable(),
  paymentSubtotals: z.record(z.number()).nullable(),
  paymentTotals: z.record(z.number()).nullable(),
  paymentDisplayTotals: z.record(z.string()).nullable(),
  paymentDisplaySubTotals: z.record(z.string()).nullable(),
  nonPayProPaymentReceived: z.boolean().optional(),
  jsonPayProRequired: z.boolean().optional(),
  merchantName: z.string().optional(),
  bitpayIdRequired: z.boolean().optional(),
  underpaidAmount: z.number().optional(),
  overpaidAmount: z.number().optional(),
  paymentCodes: z.record(z.record(z.string())).nullable(),
  isCancelled: z.boolean().optional()
});
