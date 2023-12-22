import {ClientProvider} from "../ClientProvider";
import {PayoutRecipient, PayoutRecipients} from "../../src/Model";

class RecipientRequests {
  public inviteRecipients(): void {
    const client = ClientProvider.create();

    const payoutRecipient = new PayoutRecipient('some@email.com', 'someLabel', 'https://notification.com');

    const payoutRecipients = new PayoutRecipients([payoutRecipient]);

    const recipients = client.submitPayoutRecipients(payoutRecipients);
  }

  public getRecipient(): void {
    const client = ClientProvider.create();

    const recipient = client.getPayoutRecipient('someRecipientId');

    const recipients = client.getPayoutRecipients('invited');
  }

  public updateRecipient(): void {
    const client = ClientProvider.create();

    const payoutRecipient = new PayoutRecipient('some@email.com', 'someLabel', 'https://notification.com');
    payoutRecipient.label = 'some label';

    const recipient = client.updatePayoutRecipient(payoutRecipient.id, payoutRecipient);
  }

  public removeRecipient(): void  {
    const client = ClientProvider.create();

    const result = client.deletePayoutRecipient('somePayoutRecipientId');
  }
}