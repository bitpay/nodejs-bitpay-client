import {PayoutInstruction} from "./PayoutInstruction";

export interface PayoutBatchInterface {
    token: string | null;

    amount: number | null;
    currency: string | null;
    effectiveDate: string | null;
    instructions: PayoutInstruction[];
    ledgerCurrency: string | null;

    reference: string | null;
    notificationEmail: string | null;
    notificationURL: string | null;
    pricingMethod: string | null;
    message: string | null;

    id: string | null;
    account: string | null;
    supportPhone: string | null;
    status: string | null;
    percentFee: number | null;
    fee: number | null;
    depositTotal: number | null;
    rate: number | null;
    btc: number | null;
    requestDate: string | null;
    dateExecuted: number | null;
    exchangeRates: string | null;
}

export class PayoutBatch implements PayoutBatchInterface {
    instructions: PayoutInstruction[];
    account: string | null;
    amount: number | null;
    btc: number | null;
    currency: string | null;
    dateExecuted: number | null;
    depositTotal: number | null;
    effectiveDate: string | null;
    fee: number | null;
    id: string | null;
    notificationEmail: string | null;
    notificationURL: string | null;
    percentFee: number | null;
    pricingMethod: string | null;
    rate: number | null;
    reference: string | null;
    requestDate: string | null;
    status: string | null;
    supportPhone: string | null;
    token: string | null;
    ledgerCurrency: string | null;
    exchangeRates: string | null;
    message: string | null;

    /**
     * Constructor, create an instruction-full request PayoutBatch object.
     *
     * @param currency      The three digit currency string for the PayoutBatch to use.
     * @param ledgerCurrency string Ledger currency code set for the payout request (ISO 4217 3-character currency code), it indicates on which ledger the payout request will be recorded. If not provided in the request, this parameter will be set by default to the active ledger currency on your account, e.g. your settlement currency.
     * @param instructions  Payout instructions.
     */
    public constructor(currency: string, instructions: PayoutInstruction[], ledgerCurrency: string) {
        this.currency = currency;
        this.instructions = instructions;
        this.ledgerCurrency = ledgerCurrency;
    }
}
