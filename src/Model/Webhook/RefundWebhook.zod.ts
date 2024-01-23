import { z } from 'zod';

export const refundWebhookSchema = z.object({
  amount: z.number().nullable(),
  buyerPaysRefundFee: z.boolean().nullable(),
  currency: z.string().nullable(),
  id: z.string().nullable(),
  immediate: z.boolean().nullable(),
  invoice: z.string().nullable(),
  lastRefundNotification: z.string().nullable(),
  refundFee: z.number().nullable(),
  requestDate: z.string().nullable(),
  status: z.string().nullable(),
  supportRequest: z.string().nullable(),
  reference: z.string().nullable(),
  guid: z.string().nullable(),
  refundAddress: z.string().nullable(),
  type: z.string().nullable(),
  txid: z.string().nullable(),
  transactionCurrency: z.string().nullable(),
  transactionAmount: z.number().nullable(),
  transactionRefundFee: z.number().nullable(),
})