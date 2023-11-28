import { z } from "zod"
import {payoutRecipientInterfaceSchema} from "./PayoutRecipient.zod";

export const payoutRecipientsInterfaceSchema = z.object({
  guid: z.string().optional(),
  token: z.string().optional(),
  recipients: payoutRecipientInterfaceSchema.array().optional()
})