import {PayoutInstruction} from "./PayoutInstruction";

export interface PayoutBatchInterface {
    guid: string | null;
    token: string | null;

    amount: number | null;
    currency: string | null;
    effectiveDate: string | null;
    instructions: PayoutInstruction[];

    reference: string | null;
    notificationEmail: string | null;
    notificationUrl: string | null;
    pricingMethod: string | null;

    id: string | null;
    account: string | null;
    supportPhone: string | null;
    status: string | null;
    percentFee: number | null;
    fee: number | null;
    depositTotal: number | null;
    rate: number | null;
    btc: number | null;
    requestDate: number | null;
    dateExecuted: number | null;
}

export class PayoutBatch implements PayoutBatchInterface {
    static readonly MethodVwap24 = "vwap24hr";

    instructions: PayoutInstruction[];
    account: string | null;
    amount: number | null;
    btc: number | null;
    currency: string | null;
    dateExecuted: number | null;
    depositTotal: number | null;
    effectiveDate: string | null;
    fee: number | null;
    guid: string | null;
    id: string | null;
    notificationEmail: string | null;
    notificationUrl: string | null;
    percentFee: number | null;
    pricingMethod: string | null;
    rate: number | null;
    reference: string | null;
    requestDate: number | null;
    status: string | null;
    supportPhone: string | null;
    token: string | null;

    /**
     * Constructor, create an instruction-full request PayoutBatch object.
     *
     * @param currency      The three digit currency string for the PayoutBatch to use.
     * @param effectiveDate Date when request is effective. Note that the time of day will automatically be set to 09:00:00.000 UTC time for the given day. Only requests submitted before 09:00:00.000 UTC are guaranteed to be processed on the same day.
     * @param instructions  Payout instructions.
     */
    public constructor(currency: string, effectiveDate: string, instructions: PayoutInstruction[]) {
        this.currency = currency;
        this.effectiveDate = effectiveDate;
        this.instructions = instructions;
        // this.computeAndSetAmount()
    }

    // computeAndSetAmount() {
    //     let currencyInfo = Client.GetCurrencyInfo("USD");
    //     let precision = !currencyInfo ? 2 : parseInt(currencyInfo["precision"]);
    //
    //     let amount = 0.0;
    //
    //     this.instructions.forEach(instruction => {
    //         amount += instruction.amount;
    //     });
    //
    //     this.amount = parseFloat(amount.toFixed(precision));
    // }
}
