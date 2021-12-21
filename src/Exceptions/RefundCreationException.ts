import RefundException from "./RefundException";

export class RefundCreationException implements RefundException {

    public readonly message: string = "Failed to create refund";
    public readonly name: string = "BITPAY-REFUND-CREATE";
    public readonly code: number = 162;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the RefundCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default RefundCreationException;
