import SettlementException from "./SettlementException";

export class SettlementQueryException implements SettlementException {

    public readonly message: string = "Failed to retrieve settlements";
    public readonly name: string = "BITPAY-SETTLEMENTS-GET";
    public readonly code: number = 152;
    public readonly stack: string;

    /**
     * Construct the SettlementQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default SettlementQueryException;
