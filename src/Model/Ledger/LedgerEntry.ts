import { BuyerFields } from './BuyerFields';

export interface LedgerEntryInterface {
  type: string;
  amount: number;
  code: number;
  description?: string;
  timestamp?: string;
  txType?: string;
  scale?: number;
  invoiceId: string;
  buyerFields?: BuyerFields;
  invoiceAmount: number;
  invoiceCurrency: string;
  transactionCurrency: string;
  id: string;
  supportRequest?: string;
}

export class LedgerEntry implements LedgerEntryInterface {
  type: string;
  amount: number;
  code: number;
  description?: string;
  timestamp?: string;
  txType?: string;
  scale?: number;
  invoiceId: string;
  buyerFields?: BuyerFields;
  invoiceAmount: number;
  invoiceCurrency: string;
  transactionCurrency: string;
  id: string;
  supportRequest?: string;

  public constructor() {}
}
