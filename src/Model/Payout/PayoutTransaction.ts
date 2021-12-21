export interface PayoutTransactionInterface {
    txid: string | null;
    amount: number | null;
    date: number | null;
}

export class PayoutTransaction implements PayoutTransactionInterface {

    txid: string | null;
    amount: number | null;
    date: number | null;

    public constructor() {

    }
}
