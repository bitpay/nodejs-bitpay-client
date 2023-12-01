import { z } from 'zod';

export const refundInfoSchema = z.object({
  supportRequest: z.string(),
  currency: z.string(),
  amounts: z.record(z.number()).optional()
});
