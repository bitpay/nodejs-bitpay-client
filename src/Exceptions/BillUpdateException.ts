import BitPayException from "./BitPayException";

export class BillUpdateException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the bill";
    public readonly name: string = "BITPAY-BILL-UPDATE";
    public readonly code: number = 114;
    public readonly stack: string;

    /**
     * Construct the BillUpdateException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default BillUpdateException;
