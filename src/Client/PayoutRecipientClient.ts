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

  /**
   * Submit BitPay Payout Recipients.
   *
   * @param recipients A PayoutRecipients object with request parameters defined.
   * @returns PayoutRecipients[]  A list of BitPay PayoutRecipients objects.
   * @throws PayoutRecipientCreationException
   */
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

  /**
   * Update a Payout Recipient.
   *
   * @param recipientId The recipient id for the recipient to be updated.
   * @param recipient A PayoutRecipient object with updated parameters defined.
   * @returns PayoutRecipient
   * @throws PayoutRecipientUpdateException
   */
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

  /**
   * Retrieve a BitPay payout recipient by batch id using.  The client must have been previously authorized for the payout facade.
   *
   * @param recipientId The id of the recipient to retrieve.
   * @returns PayoutRecipient
   * @throws PayoutRecipientQueryException
   */
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

  /**
   * Retrieve a collection of BitPay Payout Recipients.
   *
   * @param params
   * @returns PayoutRecipient[]
   * @throws PayoutRecipientQueryException
   */
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

  /**
   * Delete a Payout Recipient.
   *
   * @param recipientId The recipient id for the recipient to be deleted.
   * @returns boolean True if the recipient was successfully deleted, false otherwise.
   * @throws PayoutRecipientCancellationException
   */
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

  /**
   * Notify BitPay Payout Recipient.
   *
   * @param recipientId The id of the recipient to notify.
   * @returns boolean  True if the notification was successfully sent, false otherwise.
   * @throws PayoutRecipientNotificationException
   */
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
