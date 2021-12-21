import PayoutRecipientException from "./PayoutRecipientException";

export class PayoutRecipientNotificationException implements PayoutRecipientException {

    public readonly message: string = "Failed to payout recipient notification";
    public readonly name: string = "BITPAY-PAYOUT-RECIPIENT-NOTIFICATION";
    public readonly code: number = 196;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutRecipientNotificationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutRecipientNotificationException;
