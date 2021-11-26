import RefundException from "./RefundException";

export class RefundNotificationException implements RefundException {

    public readonly message: string = "Failed to request refund notification";
    public readonly name: string = "BITPAY-REFUND-NOTIFICATION";
    public readonly code: number = 166;
    public readonly stack: string;

    /**
     * Construct the RefundNotificationException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default RefundNotificationException;