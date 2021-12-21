import PayoutBatchException from "./PayoutBatchException";

export class PayoutBatchCreationException implements PayoutBatchException {

    public readonly message: string = "Failed to create payout batch";
    public readonly name: string = "BITPAY-PAYOUT-BATCH-SUBMIT";
    public readonly code: number = 202;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutBatchCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutBatchCreationException;
