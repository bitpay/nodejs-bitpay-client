export interface PayoutRecipientInterface {
    email: string;
    label: string;
    notificationURL: string;

    statu: string | null;
    i: string | null;
    shopperI: string | null;
    toke: string | null;
}

export class PayoutRecipient implements PayoutRecipientInterface {
    email: string;
    i: string | null;
    label: string;
    notificationURL: string;
    shopperI: string | null;
    statu: string | null;
    toke: string | null;

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
