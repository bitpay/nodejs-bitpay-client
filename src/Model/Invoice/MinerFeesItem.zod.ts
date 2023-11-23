import { z } from 'zod';

export const minerFeesItemSchema = z.object({
  satoshisPerByte: z.number().optional(),
  totalFee: z.number().optional(),
  fiatAmount: z.number().optional()
});
