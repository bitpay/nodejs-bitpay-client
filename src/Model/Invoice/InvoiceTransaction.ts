export interface InvoiceTransaction {
  amount: number;
  confirmations?: number;
  time?: string;
  receivedTime?: string;
  txid?: string;
}
