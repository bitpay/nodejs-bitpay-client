import { z } from "zod"

export const buyerFieldsInterfaceSchema = z.object({
  buyerName: z.string().optional(),
  buyerAddress1: z.string().optional(),
  buyerAddress2: z.string().optional(),
  buyerCity: z.string().optional(),
  buyerState: z.string().optional(),
  buyerZip: z.string().optional(),
  buyerCountry: z.string().optional(),
  buyerPhone: z.string().optional(),
  buyerNotify: z.boolean().optional(),
  buyerEmail: z.string().optional()
})
