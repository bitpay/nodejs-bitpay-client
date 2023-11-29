import { z } from 'zod';

export const invoiceTransactionSchema = z.object({
  amount: z.number(),
  confirmations: z.number().optional(),
  time: z.string().optional(),
  receivedTime: z.string().optional(),
  txid: z.string().optional()
});