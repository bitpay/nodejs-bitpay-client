import { z } from 'zod';
import { refundParamsSchema } from './RefundParams.zod';

export const refundInterfaceSchema = z.object({
  params: refundParamsSchema.optional(),

  guid: z.string().optional(),
  refundEmail: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  token: z.string().optional(),
  id: z.string(),
  requestDate: z.string(),
  status: z.string(),
  invoice: z.string(),
  supportRequest: z.string().optional(),
  refundAddress: z.string().optional(),
  txid: z.string().optional(),
  type: z.string().optional(),
  reference: z.string().optional(),
  transactionCurrency: z.string(),
  transactionAmount: z.number(),
  transactionRefundFee: z.number(),
  lastRefundNotification: z.string().optional(),
  notificationURL: z.string().optional(),
  refundFee: z.number(),
  immediate: z.boolean(),
  buyerPaysRefundFee: z.boolean(),
  preview: z.boolean().optional()
});
