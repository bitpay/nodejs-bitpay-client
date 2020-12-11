import InvoiceException from "./InvoiceException";

export class InvoiceQueryException implements InvoiceException {

    public readonly message: string = "Failed to retrieve invoice";
    public readonly name: string = "BITPAY-INVOICE-GET";
    public readonly code: number = 103;
    public readonly stack: string;

    /**
     * Construct the InvoiceQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default InvoiceQueryException;
