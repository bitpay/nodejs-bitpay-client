import InvoiceException from "./InvoiceException";

export class InvoicePaymentException implements InvoiceException {

    public readonly message: string = "Failed to pay invoice";
    public readonly name: string = "BITPAY-INVOICE-PAY-UPDATE";
    public readonly code: number = 107;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the InvoicePaymentException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default InvoicePaymentException;
