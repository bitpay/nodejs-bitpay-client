import BitPayException from "./BitPayException";

export class PayoutException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the payout batch";
    public readonly name: string = "BITPAY-PAYOUT-GENERIC";
    public readonly code: number = 121;
    public readonly stack: string;

    /**
     * Construct the PayoutException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default PayoutException;
