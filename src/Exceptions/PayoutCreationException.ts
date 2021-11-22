import PayoutException from "./PayoutException";

export class PayoutCreationException implements PayoutException {

    public readonly message: string = "Failed to create payout";
    public readonly name: string = "BITPAY-PAYOUT-SUBMIT";
    public readonly code: number = 122;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutCreationException;
