export class BitPayException implements Error {

    public readonly message: string = "Unexpected Bitpay exeption";
    public readonly name: string = "BITPAY-GENERIC";
    public readonly code: number = 100;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the BitPayException.
     *
     * @param name    string [optional] The Exception type to throw.
     * @param message string [optional] The Exception message to throw.
     * @param code    number [optional] The Exception code to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(name: string = null, message: string = null, code: number = null, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.name = Boolean(name) ? name: this.name;
        this.code = Boolean(code) ? code: this.code;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default BitPayException;
