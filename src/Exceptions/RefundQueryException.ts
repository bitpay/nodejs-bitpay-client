import RefundException from "./RefundException";

export class RefundQueryException implements RefundException {

    public readonly message: string = "Failed to retrieve refund";
    public readonly name: string = "BITPAY-REFUND-GET";
    public readonly code: number = 163;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the RefundQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default RefundQueryException;
