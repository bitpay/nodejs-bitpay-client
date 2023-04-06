export interface InvoiceTransaction {
  amount: bigint | null;
  confirmations: number | null;
  time: Date | null;
  receivedTime: Date | null;
  txid: string | null;
}
