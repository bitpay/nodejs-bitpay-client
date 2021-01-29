import BillException from "./BillException";

export class BillCreationException implements BillException {

    public readonly message: string = "Failed to create bill";
    public readonly name: string = "BITPAY-BILL-CREATE";
    public readonly code: number = 112;
    public readonly stack: string;

    /**
     * Construct the BillCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default BillCreationException;
