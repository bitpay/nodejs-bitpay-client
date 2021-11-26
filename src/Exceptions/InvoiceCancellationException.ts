import InvoiceException from "./InvoiceException";

export class InvoiceCancellationException implements InvoiceException {

    public readonly message: string = "Failed to cancel invoice object";
    public readonly name: string = "BITPAY-INVOICE-CANCEL";
    public readonly code: number = 104;
    public readonly stack: string;

    /**
     * Construct the InvoiceCancellationException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default InvoiceCancellationException;
