import { z } from 'zod';

export const currencyInterfaceSchema = z.object({
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  precision: z.number(),
  decimals: z.number(),
  plural: z.string(),
  alts: z.string(),
  minimum: z.number(),
  sanctioned: z.boolean(),
  displayCode: z.string().optional(),
  chain: z.string().optional(),
  maxSupply: z.string().optional()
});
