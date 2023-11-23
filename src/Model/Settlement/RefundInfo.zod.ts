import { z } from "zod"

export const refundInfoInterfaceSchema = z.object({
  supportRequest: z.string().optional(),
  currency: z.string(),
  refundRequestEid: z.string().optional(),
  amounts: z.record(z.number()).optional(),
})