import PayoutException from "./PayoutException";

export class PayoutQueryException implements PayoutException {

    public readonly message: string = "Failed to retrieve payout batch";
    public readonly name: string = "BITPAY-PAYOUT-BATCH-GET";
    public readonly code: number = 123;
    public readonly stack: string;

    /**
     * Construct the PayoutQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default PayoutQueryException;
