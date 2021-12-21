import PayoutRecipientException from "./PayoutRecipientException";

export class PayoutRecipientCancellationException implements PayoutRecipientException {

    public readonly message: string = "Failed to cancel payout recipient";
    public readonly name: string = "BITPAY-PAYOUT-RECIPIENT-CANCEL";
    public readonly code: number = 194;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutRecipientCancellationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutRecipientCancellationException;
