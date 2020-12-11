import BitPayException from "./BitPayException";

export class RateException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the rates";
    public readonly name: string = "BITPAY-RATES-GENERIC";
    public readonly code: number = 141;
    public readonly stack: string;

    /**
     * Construct the RateException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default RateException;
