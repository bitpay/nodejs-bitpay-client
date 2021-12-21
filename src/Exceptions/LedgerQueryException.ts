import LedgerException from "./InvoiceException";

export class LedgerQueryException implements LedgerException {

    public readonly message: string = "Failed to retrieve ledger";
    public readonly name: string = "BITPAY-LEDGER-GET";
    public readonly code: number = 132;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the LedgerQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default LedgerQueryException;
