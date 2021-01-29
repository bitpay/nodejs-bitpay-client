import PayoutException from "./PayoutException";

export class PayoutCancellationException implements PayoutException {

    public readonly message: string = "Failed to cancel payout batch";
    public readonly name: string = "BITPAY-PAYOUT-BATCH-CANCEL";
    public readonly code: number = 124;
    public readonly stack: string;

    /**
     * Construct the PayoutCancellationException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default PayoutCancellationException;
