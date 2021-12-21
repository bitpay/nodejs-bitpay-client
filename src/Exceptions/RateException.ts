import BitPayException from "./BitPayException";

export class RateException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the rates";
    public readonly name: string = "BITPAY-RATES-GENERIC";
    public readonly code: number = 141;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the RateException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default RateException;
