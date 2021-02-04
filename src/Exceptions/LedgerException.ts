import BitPayException from "./BitPayException";

export class LedgerException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the ledger";
    public readonly name: string = "BITPAY-LEDGER-GENERIC";
    public readonly code: number = 131;
    public readonly stack: string;

    /**
     * Construct the LedgerException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default LedgerException;
