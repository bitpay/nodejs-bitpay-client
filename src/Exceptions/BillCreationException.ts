import BillException from "./BillException";

export class BillCreationException implements BillException {

    public readonly message: string = "Failed to create bill";
    public readonly name: string = "BITPAY-BILL-CREATE";
    public readonly code: number = 112;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the BillCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default BillCreationException;
