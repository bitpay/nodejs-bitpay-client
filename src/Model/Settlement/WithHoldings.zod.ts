import { z } from "zod"

export const withHoldingsInterfaceSchema = z.object({
  amount: z.number(),
  code: z.string(),
  description: z.string().optional(),
  notes: z.string().optional(),
  label: z.string().optional(),
  bankCountry: z.string().optional()
})