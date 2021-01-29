import BillException from "./BillException";

export class BillQueryException implements BillException {

    public readonly message: string = "Failed to retrieve bill";
    public readonly name: string = "BITPAY-BILL-GET";
    public readonly code: number = 113;
    public readonly stack: string;

    /**
     * Construct the BillQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default BillQueryException;
