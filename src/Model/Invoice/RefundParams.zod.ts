import { z } from 'zod';

export const refundParamsSchema = z.object({
  requesterType: z.string().optional(),
  requesterEmail: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  email: z.string().optional(),
  purchaserNotifyEmail: z.string().optional(),
  refundAddress: z.string().optional(),
  supportRequestEid: z.string().optional()
});
