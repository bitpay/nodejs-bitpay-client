import PayoutBatchException from "./PayoutBatchException";

export class PayoutBatchNotificationException implements PayoutBatchException {

    public readonly message: string = "Failed to payout batch notification";
    public readonly name: string = "BITPAY-PAYOUT-BATCH-NOTIFICATION";
    public readonly code: number = 205;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutBatchNotificationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutBatchNotificationException;
