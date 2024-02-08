import { z } from 'zod';

export const invoiceRefundAddressesSchema = z.object({
  type: z.string(),
  date: z.string(),
  tag: z.number().optional().nullable(),
  email: z.string().optional().nullable()
});
