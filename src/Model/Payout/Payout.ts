import {PayoutTransaction} from "./PayoutTransaction";

export interface PayoutInterface {
    token: string | null;

    amount: number | null;
    currency: string | null;
    effectiveDate: string | null;
    ledgerCurrency: string | null;

    reference: string | null;
    notificationEmail: string | null;
    notificationURL: string | null;
    email: string | null;
    recipientId: string | null;
    shopperId: string | null;
    label: string | null;
    message: string | null;

    id: string | null;
    status: string | null;
    requestDate: number | null;
    exchangeRates: string | null;
    transactions: PayoutTransaction[];
}

export class Payout implements PayoutInterface {

    token: string | null;

    amount: number | null;
    currency: string | null;
    effectiveDate: string | null;
    ledgerCurrency: string | null;

    reference: string | null;
    notificationEmail: string | null;
    notificationURL: string | null;
    email: string | null;
    recipientId: string | null;
    shopperId: string | null;
    label: string | null;
    message: string | null;

    id: string | null;
    status: string | null;
    requestDate: number | null;
    exchangeRates: string | null;
    transactions: PayoutTransaction[];

    /**
     * Constructor, create a request Payout object.
     *
     * @param amount            The decimal amount to be paid in the Payout request.
     * @param currency          The three digit currency string for the Payout to use.
     * @param ledgerCurrency    The three digit currency string for the Payout to use.
     */
     public constructor(amount: number, currency: string, ledgerCurrency: string) {
        this.currency = currency;
        this.amount = amount;
        this.ledgerCurrency = ledgerCurrency;
    }
}