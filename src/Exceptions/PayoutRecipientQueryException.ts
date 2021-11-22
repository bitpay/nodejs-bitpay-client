import PayoutRecipientException from "./PayoutRecipientException";

export class PayoutRecipientQueryException implements PayoutRecipientException {

    public readonly message: string = "Failed to retrieve payout recipient";
    public readonly name: string = "BITPAY-PAYOUT-RECIPIENT-GET";
    public readonly code: number = 193;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutRecipientQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutRecipientQueryException;
