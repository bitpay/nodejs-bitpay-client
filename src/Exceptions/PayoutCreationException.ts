import PayoutException from "./PayoutException";

export class PayoutCreationException implements PayoutException {

    public readonly message: string = "Failed to create payout batch";
    public readonly name: string = "BITPAY-PAYOUT-BATCH-SUBMIT";
    public readonly code: number = 122;
    public readonly stack: string;

    /**
     * Construct the PayoutCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default PayoutCreationException;
