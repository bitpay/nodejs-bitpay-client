import { z } from "zod"

export const currencyQrInterfaceSchema = z.object({
  type: z.string(),
  collapsed: z.string().optional()
})