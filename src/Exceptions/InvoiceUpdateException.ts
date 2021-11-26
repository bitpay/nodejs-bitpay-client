import InvoiceException from "./InvoiceException";

export class InvoiceUpdateException implements InvoiceException {

    public readonly message: string = "Failed to update invoice object";
    public readonly name: string = "BITPAY-INVOICE-CANCEL";
    public readonly code: number = 105;
    public readonly stack: string;

    /**
     * Construct the InvoiceUpdateException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default InvoiceUpdateException;
