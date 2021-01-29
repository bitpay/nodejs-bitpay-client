import BitPayException from "./BitPayException";

export class PayoutUpdateException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the payout";
    public readonly name: string = "BITPAY-PAYOUT-UPDATE";
    public readonly code: number = 125;
    public readonly stack: string;

    /**
     * Construct the PayoutUpdateException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default PayoutUpdateException;
