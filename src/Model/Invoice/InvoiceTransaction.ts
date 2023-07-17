export interface InvoiceTransaction {
  amount: bigint;
  confirmations: number;
  time: string;
  receivedTime: string;
  txid: string;
}
