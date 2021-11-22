import SettlementException from "./SettlementException";

export class SettlementQueryException implements SettlementException {

    public readonly message: string = "Failed to retrieve settlements";
    public readonly name: string = "BITPAY-SETTLEMENTS-GET";
    public readonly code: number = 152;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the SettlementQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default SettlementQueryException;
