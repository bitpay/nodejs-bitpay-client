import InvoiceException from "./InvoiceException";

export class InvoiceQueryException implements InvoiceException {

    public readonly message: string = "Failed to retrieve invoice";
    public readonly name: string = "BITPAY-INVOICE-GET";
    public readonly code: number = 103;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the InvoiceQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default InvoiceQueryException;
