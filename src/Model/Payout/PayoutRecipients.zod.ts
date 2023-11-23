import { z } from "zod"
import {PayoutRecipients} from "./PayoutRecipients";
import {payoutRecipientInterfaceSchema} from "./PayoutRecipient.zod";

export const payoutRecipientsInterfaceSchema = z.object({
  guid: z.string().optional(),
  token: z.string().optional(),
  recipients: payoutRecipientInterfaceSchema.array().optional()
})