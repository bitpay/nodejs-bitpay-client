import BitPayException from "./BitPayException";

export class SettlementException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the settlements";
    public readonly name: string = "BITPAY-SETTLEMENTS-GENERIC";
    public readonly code: number = 151;
    public readonly stack: string;

    /**
     * Construct the SettlementException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default SettlementException;
