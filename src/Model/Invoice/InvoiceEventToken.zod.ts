import { z } from 'zod';

export const invoiceEventTokenInterfaceSchema = z.object({
  url: z.string().nullable(),
  token: z.string().nullable(),
  events: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional()
});
