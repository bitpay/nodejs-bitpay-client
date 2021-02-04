import {PayoutInfo} from "./PayoutInfo";
import {SettlementLedgerEntry} from "./SettlementLedgerEntry";
import {WithHoldings} from "./WithHoldings";

export interface SettlementInterface {

    id: string | null;
    accountId: string | null;
    currency: string | null;
    payoutInfo: PayoutInfo | null;
    status: string | null;
    dateCreated: number;
    dateExecuted: number;
    dateCompleted: number;
    openingDate: number;
    closingDate: number;
    openingBalance: number;
    ledgerEntriesSum: number;
    withHoldings: WithHoldings[];
    withHoldingsSum: number;
    totalAmount: number;
    ledgerEntries: SettlementLedgerEntry[];
    token: string | null;
}

export class Settlement implements SettlementInterface{

    id: string | null;
    accountId: string | null;
    currency: string | null;
    payoutInfo: PayoutInfo | null;
    status: string | null;
    dateCreated: number;
    dateExecuted: number;
    dateCompleted: number;
    openingDate: number;
    closingDate: number;
    openingBalance: number;
    ledgerEntriesSum: number;
    withHoldings: WithHoldings[];
    withHoldingsSum: number;
    totalAmount: number;
    ledgerEntries: SettlementLedgerEntry[];
    token: string | null;

    public constructor(){

    }
}
