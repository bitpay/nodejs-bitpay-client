import { z } from "zod"
import {currenciesInterfaceSchema} from "./Currencies.zod";

export const walletInterfaceSchema = z.object({
  currencies: currenciesInterfaceSchema.array().optional(),

  key: z.string().optional(),
  displayName: z.string().optional(),
  avatar: z.string().optional(),
  payPro: z.boolean().optional(),
  image: z.string().optional()
})