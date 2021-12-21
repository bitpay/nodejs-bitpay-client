import PayoutBatchException from "./PayoutBatchException";

export class PayoutBatchQueryException implements PayoutBatchException {

    public readonly message: string = "Failed to retrieve payout batch";
    public readonly name: string = "BITPAY-PAYOUT-BATCH-GET";
    public readonly code: number = 203;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutBatchQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutBatchQueryException;
