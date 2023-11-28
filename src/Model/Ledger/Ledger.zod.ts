import { z } from 'zod';

export const ledgerInterfaceSchema = z.object({
  currency: z.string(),
  balance: z.number()
});
