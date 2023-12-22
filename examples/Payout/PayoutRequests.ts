import {ClientProvider} from "../ClientProvider";
import {Payout} from "../../src/Model";
import {PayoutStatus} from "../../src";

class PayoutRequests {
  public createPayout(): void {
    const client = ClientProvider.create();

    const payout = new Payout(12.34, 'USD', 'USD');
    payout.notificationEmail = 'myEmail@email.com';
    payout.notificationURL = 'https://my-url.com';

    const createdPayout = client.submitPayout(payout);

    const payouts = client.submitPayouts([
      new Payout(12.34, 'USD', 'USD'),
      new Payout(56.14, 'USD', 'USD'),
    ])
  }

  public getPayouts(): void {
    const client = ClientProvider.create();

    const payout = client.getPayout('myPayoutId')

    const payouts = client.getPayouts({ status: PayoutStatus.New });
  }

  public cancelPayout(): void {
    const client = ClientProvider.create();

    const result = client.cancelPayout('somePayoutId');

    // const payoutGroupId = payout.groupId;
    const cancelledPayouts = client.cancelPayouts('payoutGroupId');
  }

  public requestPayoutWebhookToBeResent(): void {
    const client = ClientProvider.create();

    const result = client.requestPayoutNotification('somePayoutId');
  }
}