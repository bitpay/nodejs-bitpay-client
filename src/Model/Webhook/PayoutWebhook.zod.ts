import { z } from 'zod';
import { payoutTransactionInterfaceSchema } from '../Payout/PayoutTransaction.zod';

export const payoutWebhookSchema = z.object({
  id: z.string().optional(),
  recipientId: z.string().optional(),
  shopperId: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  ledgerCurrency: z.string().optional(),
  exchangeRates: z.record(z.record(z.number())).optional(),
  email: z.string().optional(),
  reference: z.string().optional(),
  label: z.string().optional(),
  notificationUrl: z.string().optional(),
  notificationEmail: z.string().optional(),
  effectiveDate: z.string().optional(),
  requestDate: z.string().optional(),
  status: z.string().optional(),
  transactions: z.array(payoutTransactionInterfaceSchema).optional(),
  accountId: z.string().optional(),
  date: z.string().optional(),
  groupId: z.string().optional()
});
