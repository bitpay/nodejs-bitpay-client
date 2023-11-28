import { z } from 'zod';

export const payoutGroupFailedInterfaceSchema = z.object({
  errMessage: z.string(),
  payoutId: z.string().optional(),
  payee: z.string().optional()
});
