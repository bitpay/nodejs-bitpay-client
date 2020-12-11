import BitPayException from "./BitPayException";

export class RefundException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the refund";
    public readonly name: string = "BITPAY-REFUND-GENERIC";
    public readonly code: number = 161;
    public readonly stack: string;

    /**
     * Construct the RefundException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default RefundException;
