import {LedgerEntry} from "./LedgerEntry";

export interface LedgerInterface {

    entries: LedgerEntry[] | [];
    currency: string;
    balance: number;
}

export class Ledger implements LedgerInterface{

    entries: LedgerEntry[] | [];
    currency: string;
    balance: number;

    public constructor(){

    }
}
