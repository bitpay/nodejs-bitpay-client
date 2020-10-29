export interface InvoiceTransaction {
    amount: bigint;
    confirmations: number;
    time: Date;
    receivedTime: Date;
    txid: string;
}
