export interface LedgerInterface {

    currency: string;
    balance: number;
}

export class Ledger implements LedgerInterface{

    currency: string;
    balance: number;

    public constructor() {
    }
}
