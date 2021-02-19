import BitPayException from "./BitPayException";

export class SubscriptionException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the subscription";
    public readonly name: string = "BITPAY-SUBSCRIPTION-GENERIC";
    public readonly code: number = 171;
    public readonly stack: string;

    /**
     * Construct the SubscriptionException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default SubscriptionException;
