import { InvoiceWebhookBuyerFieldsInterface } from './InvoiceWebhookBuyerFields';

export interface InvoiceWebhook {
  id?: string;
  url?: string;
  posData?: string;
  status?: string;
  price?: string;
  currency?: string;
  invoiceTime?: string;
  currencyTime?: string;
  exceptionStatus?: string;
  buyerFields?: InvoiceWebhookBuyerFieldsInterface;
  paymentSubtotals?: Record<string, number>;
  paymentTotals?: Record<string, number>;
  exchangeRates?: Record<string, Record<string, number>>;
  amountPaid?: number;
  orderId?: string;
  transactionCurrency?: string;
  inInvoiceId?: string;
  inPaymentRequest?: string;
}
