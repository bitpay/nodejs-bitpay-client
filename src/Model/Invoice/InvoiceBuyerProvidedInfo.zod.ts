import { z } from 'zod';

export const invoiceBuyerProvidedInfoSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  sms: z.string().optional(),
  smsVerified: z.boolean().optional(),
  selectedTransactionCurrency: z.string().optional(),
  emailAddress: z.string().optional(),
  selectedWallet: z.string().optional()
});
