import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { GuidGenerator } from '../util/GuidGenerator';
import { Facade } from '../Facade';
import { PayoutInterface } from '../Model';
import { BitPayResponseParser } from '../util/BitPayResponseParser';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';

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
   * @returns Payout
   * @throws PayoutCreationException
   */
  public async submit(payout: PayoutInterface): Promise<PayoutInterface> {
    payout.token = this.tokenContainer.getToken(Facade.Payout);
    const result = await this.bitPayClient.post('payouts', payout, true);

    try {
      return <PayoutInterface>JSON.parse(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Payout', e.message);
    }
  }

  /**
   * Retrieve a BitPay payout by payout id using. The client must have been previously authorized
   * for the payout facade.
   *
   * @param payoutId The id of the payout to retrieve.
   * @returns Payout
   * @throws PayoutQueryException
   */
  public async get(payoutId: string): Promise<PayoutInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };
    const result = await this.bitPayClient.get('payouts/' + payoutId, params, true);

    try {
      return <PayoutInterface>JSON.parse(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Payout', e.message);
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
    const result = await this.bitPayClient.get('payouts', params, true);

    try {
      return <PayoutInterface[]>JSON.parse(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Payout', e.message);
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
    const result = await this.bitPayClient.post('payouts/' + payoutId + '/notifications', params, true);

    try {
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Payout', e.message);
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
    const result = await this.bitPayClient.delete('payouts/' + payoutId, params, true);

    try {
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Payout', e.message);
    }
  };
}
