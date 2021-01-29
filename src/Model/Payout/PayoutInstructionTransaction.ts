export interface PayoutInstructionTransactionInterface {
    txid: string | null;
    amount: number | null;
    date: number | null;
}

export class PayoutInstructionTransaction implements PayoutInstructionTransactionInterface {

    txid: string | null;
    amount: number | null;
    date: number | null;

    public constructor() {

    }
}
