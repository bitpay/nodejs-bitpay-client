export interface PayoutTransactionInterface {
  txid: string;
  amount: number;
  date: string;
}

export class PayoutTransaction implements PayoutTransactionInterface {
  txid: string;
  amount: number;
  date: string;

  public constructor() {}
}
