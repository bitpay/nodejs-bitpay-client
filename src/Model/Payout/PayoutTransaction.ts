export interface PayoutTransactionInterface {
  txid: string;
  amount: number;
  date: string;
  confirmations?: number;
}

export class PayoutTransaction implements PayoutTransactionInterface {
  txid: string;
  amount: number;
  date: string;
  confirmations?: number;

  public constructor() {}
}
