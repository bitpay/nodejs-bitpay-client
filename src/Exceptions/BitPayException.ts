export class BitPayException implements Error {

    public readonly message: string = "Unexpected Bitpay exeption";
    public readonly name: string = "BITPAY-GENERIC";
    public readonly code: number = 100;
    public readonly stack: string;

    /**
     * Construct the BitPayException.
     *
     * @param name    string [optional] The Exception type to throw.
     * @param message string [optional] The Exception message to throw.
     * @param code    number [optional] The Exception code to throw.
     */
    public constructor(name: string = null, message: string = null, code: number = null) {
        this.message = Boolean(message) ? message: this.message;
        this.name = Boolean(name) ? name: this.name;
        this.code = Boolean(code) ? code: this.code;
    }
}

export default BitPayException;
