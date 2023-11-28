import { z } from 'zod';

export const rateInterfaceSchema = z.object({
  name: z.string(),
  code: z.string(),
  rate: z.number()
});
