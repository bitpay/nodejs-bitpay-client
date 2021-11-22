import SubscriptionException from "./SubscriptionException";

export class SubscriptionCreationException implements SubscriptionException {

    public readonly message: string = "Failed to create subscription";
    public readonly name: string = "BITPAY-SUBSCRIPTION-CREATE";
    public readonly code: number = 172;
    public readonly stack: string;
    public readonly apiCode: string = "000000";

    /**
     * Construct the SubscriptionCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    public constructor(message: string, apiCode: string = "000000") {
        this.message = Boolean(message) ? message: this.message;
        this.apiCode = Boolean(apiCode) ? apiCode: this.apiCode;
    }
}

export default SubscriptionCreationException;
