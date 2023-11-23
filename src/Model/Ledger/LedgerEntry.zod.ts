import { z } from "zod"
import {buyerFieldsInterfaceSchema} from "./BuyerFields.zod";

export const ledgerEntryInterfaceSchema = z.object({
  buyerFields: buyerFieldsInterfaceSchema,

  type: z.string(),
  amount: z.number(),
  code: z.number(),
  description: z.string().optional(),
  timestamp: z.string().optional(),
  txType: z.string().optional(),
  scale: z.number().optional(),
  invoiceId: z.string(),
  invoiceAmount: z.number(),
  invoiceCurrency: z.string(),
  transactionCurrency: z.string(),
  id: z.string(),
  supportRequest: z.string().optional()
})