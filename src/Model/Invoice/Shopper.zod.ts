import { z } from 'zod';

export const shopperSchema = z.object({
  user: z.string().optional()
});
