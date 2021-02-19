import SubscriptionException from "./SubscriptionException";

export class SubscriptionCreationException implements SubscriptionException {

    public readonly message: string = "Failed to create subscription";
    public readonly name: string = "BITPAY-SUBSCRIPTION-CREATE";
    public readonly code: number = 172;
    public readonly stack: string;

    /**
     * Construct the SubscriptionCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default SubscriptionCreationException;
