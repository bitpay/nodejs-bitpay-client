import PayoutException from "./PayoutException";

export class PayoutCancellationException implements PayoutException {

    public readonly message: string = "Failed to cancel payout";
    public readonly name: string = "BITPAY-PAYOUT-CANCEL";
    public readonly code: number = 124;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutCancellationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutCancellationException;
