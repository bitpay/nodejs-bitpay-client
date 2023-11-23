import { z } from "zod"
import {invoiceDataInterfaceSchema} from "./InvoiceData.zod";

export const settlementLedgerEntryInterfaceSchema = z.object({
  invoiceData: invoiceDataInterfaceSchema.optional(),

  amount: z.number(),
  code: z.number().optional(),
  invoiceId: z.string().optional(),
  timestamp: z.string().optional(),
  description: z.string().optional()
})
