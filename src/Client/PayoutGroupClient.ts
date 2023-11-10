import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { GuidGenerator } from '../util/GuidGenerator';
import { PayoutGroupInterface, PayoutInterface } from '../Model';
import { Facade } from '../Facade';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';
import { PayoutGroup } from '../Model/Payout/PayoutGroup';

export class PayoutGroupClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;
  private guidGenerator: GuidGenerator;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer, guidGenerator: GuidGenerator) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
    this.guidGenerator = guidGenerator;
  }

  /**
   *
   * @param payouts
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  submitPayouts = async (payouts: PayoutInterface[]): Promise<PayoutGroupInterface> => {
    const params = { token: this.tokenContainer.getToken(Facade.Payout), instructions: payouts };
    const result = await this.bitPayClient.post('payouts/group', params, true);

    return PayoutGroupClient.getPayoutGroupResponse(result, 'created');
  };

  /**
   *
   * @param payoutGroupId
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  cancelPayouts = async (payoutGroupId: string) => {
    const params = { token: this.tokenContainer.getToken(Facade.Payout) };
    const result = await this.bitPayClient.delete('payouts/group/' + payoutGroupId, params, true);

    return PayoutGroupClient.getPayoutGroupResponse(result, 'cancelled');
  };

  private static getPayoutGroupResponse(json: string, responseType: string): PayoutGroupInterface {
    const response = JSON.parse(json);

    if (!(responseType in response)) {
      BitPayExceptionProvider.throwDeserializeResourceException('Payout Group', response);
    }

    return new PayoutGroup(response[responseType], response['failed']);
  }
}
