import {Buyer} from "./Buyer";

export interface LedgerEntryInterface {

    type: string | null;
    amount: string | null;
    code: string | null;
    description: string | null;
    timestamp: string | null;
    txType: string | null;
    scale: string | null;
    invoiceId: string | null;
    buyer: Buyer | null;
    invoiceAmount: number;
    invoiceCurrency: string | null;
    transactionCurrency: string | null;
    id: string | null;
    supportRequest: string | null;
}

export class LedgerEntry implements LedgerEntryInterface{

    type: string | null;
    amount: string | null;
    code: string | null;
    description: string | null;
    timestamp: string | null;
    txType: string | null;
    scale: string | null;
    invoiceId: string | null;
    buyer: Buyer | null;
    invoiceAmount: number;
    invoiceCurrency: string | null;
    transactionCurrency: string | null;
    id: string | null;
    supportRequest: string | null;

    public constructor(){

    }
}
