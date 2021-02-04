import LedgerException from "./InvoiceException";

export class LedgerQueryException implements LedgerException {

    public readonly message: string = "Failed to retrieve ledger";
    public readonly name: string = "BITPAY-LEDGER-GET";
    public readonly code: number = 132;
    public readonly stack: string;

    /**
     * Construct the LedgerQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default LedgerQueryException;
