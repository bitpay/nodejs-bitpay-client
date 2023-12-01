import { z } from 'zod';

export const buyerInterfaceSchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  locality: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  notify: z.boolean().optional()
});
