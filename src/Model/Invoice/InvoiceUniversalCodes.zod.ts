import { z } from 'zod';

export const invoiceUniversalCodesSchema = z.object({
  paymentString: z.string().optional(),
  verificationLink: z.string().optional()
});
