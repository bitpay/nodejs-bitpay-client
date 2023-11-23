export interface PayoutRecipientInterface {
  email?: string | null;
  label?: string | null;
  notificationURL?: string | null;

  status?: string;
  id?: string;
  shopperId?: string | null;
  token?: string;
  guid?: string;
}

export class PayoutRecipient implements PayoutRecipientInterface {
  email?: string;
  id?: string;
  label?: string;
  notificationURL?: string;
  shopperId: string | null;
  status?: string;
  token?: string;
  guid?: string;


  /**
   * Constructor, create a minimal Recipient object.
   *
   * @param email           string Recipient email address to which the invite shall be sent.
   * @param label           string Recipient nickname assigned by the merchant (Optional).
   * @param notificationURL string URL to which BitPay sends webhook notifications to inform the merchant about the
   *                        status of a given recipient. HTTPS is mandatory (Optional).
   */
  public constructor(email: string | null, label: string | null, notificationURL: string | null);
  public constructor(email: string, label: string, notificationURL: string) {
    this.email = email;
    this.label = label;
    this.notificationURL = notificationURL;
  }
}
