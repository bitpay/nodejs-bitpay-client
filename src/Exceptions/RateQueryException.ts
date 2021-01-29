import RateException from "./RateException";

export class RateQueryException implements RateException {

    public readonly message: string = "Failed to retrieve rates";
    public readonly name: string = "BITPAY-RATES-GET";
    public readonly code: number = 142;
    public readonly stack: string;

    /**
     * Construct the RateQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default RateQueryException;
