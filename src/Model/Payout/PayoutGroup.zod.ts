import { z } from "zod"
import {payoutInterfaceSchema} from "./Payout.zod";
import {payoutGroupFailedInterfaceSchema} from "./PayoutGroupFailed.zod";

export const payoutGroupInterfaceSchema = z.object({
  payouts: payoutInterfaceSchema.array(),
  failed: payoutGroupFailedInterfaceSchema.array()
})