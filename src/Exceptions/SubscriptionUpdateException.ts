import SubscriptionException from "./SubscriptionException";

export class SubscriptionUpdateException implements SubscriptionException {

    public readonly message: string = "An unexpected error occurred while trying to manage the subscription";
    public readonly name: string = "BITPAY-SUBSCRIPTION-UPDATE";
    public readonly code: number = 174;
    public readonly stack: string;

    /**
     * Construct the SubscriptionUpdateException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default SubscriptionUpdateException;
