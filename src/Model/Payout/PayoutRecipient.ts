export interface PayoutRecipientInterface {
    email: string;
    label: string;
    notificationURL: string;

    status: string | null;
    id: string | null;
    shopperId: string | null;
    token: string | null;
}

export class PayoutRecipient implements PayoutRecipientInterface {
    email: string;
    id: string | null;
    label: string;
    notificationURL: string;
    shopperId: string | null;
    status: string | null;
    token: string | null;

    /**
     * Constructor, create a minimal Recipient object.
     *
     * @param email           string Recipient email address to which the invite shall be sent.
     * @param label           string Recipient nickname assigned by the merchant (Optional).
     * @param notificationURL string URL to which BitPay sends webhook notifications to inform the merchant about the
     *                        status of a given recipient. HTTPS is mandatory (Optional).
     */
    public constructor(email: string, label: string, notificationURL: string) {
        this.email = email;
        this.label = label;
        this.notificationURL = notificationURL;
    }
}
