import {PayoutRecipient} from "./PayoutRecipient";

export interface PayoutRecipientsInterface {
    guid: string | null;
    recipients: Array<PayoutRecipient> | null;
    token: string | null;
}

export class PayoutRecipients implements PayoutRecipientsInterface {
    guid: string | null;
    recipients: Array<PayoutRecipient> | null;
    token: string | null;

    /**
     * Constructor, create an recipient-full request PayoutBatch object.
     *
     * @param recipients array array of JSON objects, with containing the following parameters.
     */
    public constructor(recipients: Array<PayoutRecipient>) {
        this.recipients = recipients;
    }
}
