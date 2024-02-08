import { z } from 'zod';
import { invoiceWebhookBuyerFieldsInterfaceSchema } from './InvoiceBuyerFields.zod';

export const invoiceWebhookSchema = z.object({
  id: z.string().optional(),
  url: z.string().optional(),
  posData: z.string().optional(),
  status: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().optional(),
  invoiceTime: z.string().optional(),
  currencyTime: z.string().optional(),
  exceptionStatus: z.string().optional(),
  buyerFields: invoiceWebhookBuyerFieldsInterfaceSchema.optional(),
  paymentSubtotals: z.record(z.number()).nullable(),
  paymentTotals: z.record(z.number()).nullable(),
  exchangeRates: z.record(z.record(z.number())).nullable(),
  amountPaid: z.number().optional(),
  orderId: z.string().optional(),
  transactionCurrency: z.string().optional(),
  inInvoiceId: z.string().optional(),
  inPaymentRequest: z.string().optional()
});
