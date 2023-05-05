import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { GuidGenerator } from '../util/GuidGenerator';
import { PayoutRecipientInterface, PayoutRecipients } from '../Model';
import { BitPayExceptions as Exceptions, Facade } from '../index';
import { BitPayResponseParser } from '../util/BitPayResponseParser';

export class PayoutRecipientClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;
  private guidGenerator: GuidGenerator;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer, guidGenerator: GuidGenerator) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
    this.guidGenerator = guidGenerator;
  }

  public async submit(recipients: PayoutRecipients): Promise<PayoutRecipientInterface[]> {
    recipients.token = this.tokenContainer.getToken(Facade.Payout);
    recipients.guid = recipients.guid ? recipients.guid : this.guidGenerator.execute();

    try {
      const result = await this.bitPayClient.post('recipients', recipients, true);
      return <PayoutRecipientInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.PayoutRecipientCreation(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async update(recipientId: string, recipient: PayoutRecipientInterface): Promise<PayoutRecipientInterface> {
    recipient.token = this.tokenContainer.getToken(Facade.Payout);
    recipient.guid = recipient.guid ? recipient.guid : this.guidGenerator.execute();

    try {
      const result = await this.bitPayClient.put('recipients/' + recipientId, recipient, true);
      return <PayoutRecipientInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.PayoutRecipientUpdate(
        'failed to deserialize BitPay server response (PayoutRecipient) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async get(recipientId: string): Promise<PayoutRecipientInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };

    try {
      const result = await this.bitPayClient.get('recipients/' + recipientId, params, true);
      return <PayoutRecipientInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.PayoutRecipientQuery(
        'failed to deserialize BitPay server response (PayoutRecipient) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async getByFilters(params: object): Promise<PayoutRecipientInterface[]> {
    try {
      params['token'] = this.tokenContainer.getToken(Facade.Payout);

      const result = await this.bitPayClient.get('recipients', params, true);
      return <PayoutRecipientInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.PayoutRecipientQuery(
        'failed to deserialize BitPay server response (PayoutRecipients) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async delete(recipientId: string): Promise<boolean> {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };

    try {
      const result = await this.bitPayClient.delete('recipients/' + recipientId, params, true);
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      throw new Exceptions.PayoutRecipientCancellation(
        'failed to deserialize BitPay server response (PayoutRecipient) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async requestNotification(recipientId: string): Promise<boolean> {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };

    try {
      const result = await this.bitPayClient.post('recipients/' + recipientId + '/notifications', params, true);
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      throw new Exceptions.PayoutRecipientNotification(
        'failed to deserialize BitPay server response (PayoutRecipient) : ' + e.message,
        e.apiCode
      );
    }
  }
}
