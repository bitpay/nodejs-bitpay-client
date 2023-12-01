import { z } from 'zod';

export const supportedTransactionCurrencySchema = z.object({
  enabled: z.boolean(),
  reason: z.string().optional()
});
