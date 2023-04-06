import { PayoutInfo } from './PayoutInfo';
import { SettlementLedgerEntry } from './SettlementLedgerEntry';
import { WithHoldings } from './WithHoldings';

export interface SettlementInterface {
  id: string | null;
  accountId: string | null;
  currency: string | null;
  payoutInfo: PayoutInfo | null;
  status: string | null;
  dateCreated: number;
  dateExecuted: number;
  openingDate: number;
  closingDate: number;
  openingBalance: number;
  ledgerEntriesSum: number;
  withholdings: WithHoldings[];
  withholdingsSum: number;
  totalAmount: number;
  ledgerEntries: SettlementLedgerEntry[];
  token: string | null;
}

export class Settlement implements SettlementInterface {
  id: string | null;
  accountId: string | null;
  currency: string | null;
  payoutInfo: PayoutInfo | null;
  status: string | null;
  dateCreated: number;
  dateExecuted: number;
  openingDate: number;
  closingDate: number;
  openingBalance: number;
  ledgerEntriesSum: number;
  withholdings: WithHoldings[];
  withholdingsSum: number;
  totalAmount: number;
  ledgerEntries: SettlementLedgerEntry[];
  token: string | null;

  public constructor() {}
}
