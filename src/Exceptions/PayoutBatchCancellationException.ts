import PayoutBatchException from "./PayoutBatchException";

export class PayoutBatchCancellationException implements PayoutBatchException {

    public readonly message: string = "Failed to cancel payout batch";
    public readonly name: string = "BITPAY-PAYOUT-BATCH-CANCEL";
    public readonly code: number = 204;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutBatchCancellationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutBatchCancellationException;
