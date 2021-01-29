import InvoiceException from "./InvoiceException";

export class InvoiceCreationException implements InvoiceException {

    public readonly message: string = "Failed to create invoice";
    public readonly name: string = "BITPAY-INVOICE-CREATE";
    public readonly code: number = 102;
    public readonly stack: string;

    /**
     * Construct the InvoiceCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default InvoiceCreationException;
