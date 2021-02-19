import SubscriptionException from "./SubscriptionException";

export class SubscriptionQueryException implements SubscriptionException {

    public readonly message: string = "Failed to retrieve subscription";
    public readonly name: string = "BITPAY-SUBSCRIPTION-GET";
    public readonly code: number = 173;
    public readonly stack: string;

    /**
     * Construct the SubscriptionQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default SubscriptionQueryException;
