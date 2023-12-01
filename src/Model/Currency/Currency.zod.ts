import { z } from 'zod';

export const currencyInterfaceSchema = z.object({
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  precision: z.number(),
  decimals: z.number()
});
