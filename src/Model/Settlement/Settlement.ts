import { PayoutInfo } from './PayoutInfo';
import { SettlementLedgerEntry } from './SettlementLedgerEntry';
import { WithHoldings } from './WithHoldings';

export interface SettlementInterface {
  id: string | null;
  accountId: string | null;
  currency: string;
  payoutInfo?: PayoutInfo;
  status: string;
  dateCreated: string;
  dateExecuted: string;
  openingDate: string;
  closingDate: string;
  openingBalance: number;
  ledgerEntriesSum: number;
  withholdings?: WithHoldings[];
  withholdingsSum?: number;
  totalAmount: number;
  ledgerEntries?: SettlementLedgerEntry[];
  token?: string;
}

export class Settlement implements SettlementInterface {
  id: string | null;
  accountId: string | null;
  currency: string;
  payoutInfo?: PayoutInfo;
  status: string;
  dateCreated: string;
  dateExecuted: string;
  openingDate: string;
  closingDate: string;
  openingBalance: number;
  ledgerEntriesSum: number;
  withholdings?: WithHoldings[];
  withholdingsSum?: number;
  totalAmount: number;
  ledgerEntries?: SettlementLedgerEntry[];
  token?: string;

  public constructor() {}
}
