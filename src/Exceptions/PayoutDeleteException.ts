import BitPayException from "./BitPayException";

export class PayoutDeleteException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the payout";
    public readonly name: string = "BITPAY-PAYOUT-DELETE";
    public readonly code: number = 126;
    public readonly stack: string;

    /**
     * Construct the PayoutDeleteException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default PayoutDeleteException;
