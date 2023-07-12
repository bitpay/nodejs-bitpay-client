import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { GuidGenerator } from '../util/GuidGenerator';
import { Facade } from '../Facade';
import { BitPayExceptions as Exceptions } from '../index';
import { PayoutInterface} from '../Model';
import { BitPayResponseParser } from '../util/BitPayResponseParser';
import { PayoutGroup, PayoutGroupInterface} from "../Model/Payout/PayoutGroup";

export class PayoutClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;
  private guidGenerator: GuidGenerator;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer, guidGenerator: GuidGenerator) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
    this.guidGenerator = guidGenerator;
  }

  /**
   * Submit a BitPay Payout.
   *
   * @param payout Payout object with request parameters defined.
   * @returns Pyaout
   * @throws PayoutCreationException
   */
  public async submit(payout: PayoutInterface): Promise<PayoutInterface> {
    payout.token = this.tokenContainer.getToken(Facade.Payout);

    try {
      const result = await this.bitPayClient.post('payouts', payout, true);
      return <PayoutInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.PayoutCreation(
        'failed to deserialize BitPay server response (Payout) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Retrieve a BitPay payout by payout id using. The client must have been previously authorized
   * for the payout facade.
   *
   * @param payoutId The id of the payout to retrieve.
   * @returns Pyaout
   * @throws PayoutQueryException
   */
  public async get(payoutId: string): Promise<PayoutInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };

    try {
      const result = await this.bitPayClient.get('payouts/' + payoutId, params, true);
      return <PayoutInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.PayoutQuery(
        'failed to deserialize BitPay server response (Payout) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Retrieve a collection of BitPay payouts.
   *
   * @param params
   * @returns Payout[]
   * @throws PayoutQueryException
   */
  public async getPayouts(params: object): Promise<PayoutInterface[]> {
    params['token'] = this.tokenContainer.getToken(Facade.Payout);

    try {
      const result = await this.bitPayClient.get('payouts', params, true);
      return <PayoutInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.PayoutQuery(
        'failed to deserialize BitPay server response (Payout) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Notify BitPay Payout.
   *
   * @param payoutId The id of the Payout to notify.
   * @returns boolean
   * @throws PayoutNotificationException
   */
  public requestNotification = async (payoutId: string): Promise<boolean> => {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };

    try {
      const result = await this.bitPayClient.post('payouts/' + payoutId + '/notifications', params, true);
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      throw new Exceptions.PayoutNotification(
        'failed to deserialize BitPay server response (Payout) : ' + e.message,
        e.apiCode
      );
    }
  };

  /**
   *  Cancel a BitPay Payout.
   *
   * @param payoutId
   * @returns boolean
   * @throws PayoutDeleteException
   */
  public cancel = async (payoutId: string): Promise<boolean> => {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };

    try {
      const result = await this.bitPayClient.delete('payouts/' + payoutId, params, true);
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      throw new Exceptions.PayoutDelete(
        'failed to deserialize BitPay server response (Payout) : ' + e.message,
        e.apiCode
      );
    }
  };

  submitPayouts = async (payouts: PayoutInterface[]): Promise<PayoutGroupInterface> => {
    const params = { token: this.tokenContainer.getToken(Facade.Payout), instructions: payouts };
    try {
      const result = await this.bitPayClient.post('payouts/group', params, true);
      return PayoutClient.getPayoutGroupResponse(result, 'created');
    } catch (e) {
      throw new Exceptions.PayoutCreation(
          'failed to deserialize BitPay server response (Payout) : ' + e.message,
          e.apiCode
      )
    }
  }

  cancelPayouts = async (payoutGroupId: string) => {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };
    try {
      const result = await this.bitPayClient.delete('payouts/group/' + payoutGroupId, params, true);
      return PayoutClient.getPayoutGroupResponse(result, 'cancelled')
    } catch (e) {
      throw new Exceptions.PayoutCreation(
          'failed to deserialize BitPay server response (Payout) : ' + e.message,
          e.apiCode
      )
    }
  }

  private static getPayoutGroupResponse(json: string, responseType: string): PayoutGroupInterface {
    const response = JSON.parse(json);

    if (!(responseType in response)) {
      throw new Exceptions.PayoutCreation('Cannot parse Payout Group. Response : ' + response)
    }

    return new PayoutGroup(response[responseType], response['failed']);
  }
}
