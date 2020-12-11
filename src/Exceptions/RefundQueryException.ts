import RefundException from "./RefundException";

export class RefundQueryException implements RefundException {

    public readonly message: string = "Failed to retrieve refund";
    public readonly name: string = "BITPAY-REFUND-GET";
    public readonly code: number = 163;
    public readonly stack: string;

    /**
     * Construct the RefundQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default RefundQueryException;
