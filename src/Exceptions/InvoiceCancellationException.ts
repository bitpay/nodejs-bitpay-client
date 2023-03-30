import InvoiceException from "./InvoiceException";

export class InvoiceCancellationException implements InvoiceException {

    public readonly message: string = "Failed to cancel invoice";
    public readonly name: string = "BITPAY-INVOICE-CANCEL";
    public readonly code: number = 202; //TODO: Find the correct code
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the InvoiceCancellationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default InvoiceCancellationException;
