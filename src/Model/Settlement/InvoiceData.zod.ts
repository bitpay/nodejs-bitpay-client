import { z } from 'zod';
import { refundInfoInterfaceSchema } from './RefundInfo.zod';

export const invoiceDataInterfaceSchema = z.object({
  refundInfo: refundInfoInterfaceSchema.optional(),

  price: z.number(),
  orderId: z.string().optional(),
  date: z.string().optional(),
  currency: z.string().optional(),
  transactionCurrency: z.string().optional(),
  payoutPercentage: z.record(z.number()).optional()
});
