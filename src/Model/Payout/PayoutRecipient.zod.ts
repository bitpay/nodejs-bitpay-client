import { z } from "zod"

export const payoutRecipientInterfaceSchema = z.object({
  email: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
  notificationURL: z.string().optional().nullable(),
  status: z.string().optional(),
  id: z.string().optional(),
  shopperId: z.string().nullable().optional(),
  token: z.string().optional(),
  guid: z.string().optional()
})
