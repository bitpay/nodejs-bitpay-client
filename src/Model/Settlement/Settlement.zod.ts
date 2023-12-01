import { z } from 'zod';
import { withHoldingsInterfaceSchema } from './WithHoldings.zod';
import { payoutInfoInterfaceSchema } from './PayoutInfo.zod';
import { settlementLedgerEntryInterfaceSchema } from './SettlementLedgerEntry.zod';

export const settlementInterfaceSchema = z.object({
  payoutInfo: payoutInfoInterfaceSchema.optional(),
  withholdings: withHoldingsInterfaceSchema.array().optional(),
  ledgerEntries: settlementLedgerEntryInterfaceSchema.array().optional(),

  id: z.string().nullable(),
  accountId: z.string().nullable(),
  currency: z.string(),
  status: z.string(),
  dateCreated: z.string(),
  dateExecuted: z.string(),
  openingDate: z.string(),
  closingDate: z.string(),
  openingBalance: z.number(),
  ledgerEntriesSum: z.number(),
  withholdingsSum: z.number().optional(),
  totalAmount: z.number(),
  token: z.string().optional()
});
