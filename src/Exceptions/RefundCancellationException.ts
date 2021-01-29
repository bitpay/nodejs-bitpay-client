import RefundException from "./RefundException";

export class RefundCancellationException implements RefundException {

    public readonly message: string = "Failed to create refund";
    public readonly name: string = "BITPAY-REFUND-CREATE";
    public readonly code: number = 164;
    public readonly stack: string;

    /**
     * Construct the RefundCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default RefundCancellationException;
