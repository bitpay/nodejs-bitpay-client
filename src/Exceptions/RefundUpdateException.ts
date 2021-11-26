import RefundException from "./RefundException";

export class RefundUpdateException implements RefundException {

    public readonly message: string = "Failed to update refund";
    public readonly name: string = "BITPAY-REFUND-UPDATE";
    public readonly code: number = 165;
    public readonly stack: string;

    /**
     * Construct the RefundUpdateException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default RefundUpdateException;
