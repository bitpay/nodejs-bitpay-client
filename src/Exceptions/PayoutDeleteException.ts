import PayoutException from "./PayoutException";

export class PayoutDeleteException implements PayoutException {

    public readonly message: string = "Failed to delete payout";
    public readonly name: string = "BITPAY-PAYOUT-DELETE";
    public readonly code: number = 126;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the PayoutDeleteException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default PayoutDeleteException;
