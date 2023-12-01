import { z } from 'zod';
import { payoutTransactionInterfaceSchema } from './PayoutTransaction.zod';

export const payoutInterfaceSchema = z.object({
  transactions: payoutTransactionInterfaceSchema.array().optional(),

  token: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  effectiveDate: z.string().optional(),
  dateExecuted: z.string().optional(),
  ledgerCurrency: z.string().optional(),
  accountId: z.string().optional(),
  reference: z.string().optional(),
  notificationEmail: z.string().optional(),
  notificationURL: z.string().optional(),
  email: z.string().optional(),
  recipientId: z.string().optional(),
  shopperId: z.string().optional(),
  label: z.string().optional(),
  message: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  groupId: z.string().optional(),
  requestDate: z.string().optional(),
  exchangeRates: z.record(z.record(z.number())).optional(),
  code: z.number().optional(),
  ignoreEmails: z.boolean().optional()
});
