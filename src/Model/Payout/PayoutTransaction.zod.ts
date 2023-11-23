import { z } from "zod"

export const payoutTransactionInterfaceSchema = z.object({
  txid: z.string(),
  amount: z.number(),
  date: z.string()
})