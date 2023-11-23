import { z } from 'zod';

export const itemInterfaceSchema = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  price: z.number(),
  quantity: z.number()
});
