import PayoutException from "./PayoutException";

export class PayoutUpdateException implements PayoutException {

    public readonly message: string = "An unexpected error occurred while trying to manage the payout";
    public readonly name: string = "BITPAY-PAYOUT-UPDATE";
    public readonly code: number = 125;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutUpdateException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutUpdateException;
