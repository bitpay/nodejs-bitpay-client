import BitPayException from "./BitPayException";

export class BillException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the bill";
    public readonly name: string = "BITPAY-BILL-GENERIC";
    public readonly code: number = 111;
    public readonly stack: string;

    /**
     * Construct the BillException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default BillException;
