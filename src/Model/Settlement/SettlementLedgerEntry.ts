import { InvoiceData } from './InvoiceData';

export interface SettlementLedgerEntryInterface {
  amount: number;
  code?: number;
  invoiceId?: string;
  timestamp?: string;
  description?: string;
  invoiceData?: InvoiceData;
}

export class SettlementLedgerEntry implements SettlementLedgerEntryInterface {
  amount: number;
  code?: number;
  invoiceId?: string;
  timestamp?: string;
  description?: string;
  invoiceData?: InvoiceData;

  public constructor() {}
}
