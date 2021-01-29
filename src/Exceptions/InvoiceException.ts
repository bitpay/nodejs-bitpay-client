import BitPayException from "./BitPayException";

export class InvoiceException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the invoice";
    public readonly name: string = "BITPAY-INVOICE-GENERIC";
    public readonly code: number = 101;
    public readonly stack: string;

    /**
     * Construct the InvoiceException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default InvoiceException;
