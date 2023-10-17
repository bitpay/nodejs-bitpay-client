import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { SettlementInterface } from '../Model/Settlement/Settlement';
import { Facade } from '../index';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';

export class SettlementClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
  }

  /**
   * Retrieves a summary of the specified settlement.
   *
   * @param settlementId Settlement Id
   * @returns Settlement
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async get(settlementId: string): Promise<SettlementInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.get('settlements/' + settlementId, params, true);
      return <SettlementInterface>JSON.parse(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Settlement', e.message);
    }
  }

  /**
   * Retrieves settlement reports for the calling merchant filtered by query.
   *
   * @param params
   * @returns Settlement[]
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async getSettlements(params: object): Promise<SettlementInterface[]> {
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    const result = await this.bitPayClient.get('settlements', params, true);

    try {
      return <SettlementInterface[]>JSON.parse(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Settlement', e.message);
    }
  }

  /**
   * Gets a detailed reconciliation report of the activity within the settlement period.
   *
   * @param settlementId
   * @param token
   * @returns Settlement
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async getReconciliationReport(settlementId: string, token: string): Promise<SettlementInterface> {
    const params = { token: token };

    const result = await this.bitPayClient.get('settlements/' + settlementId + '/reconciliationReport', params, true);

    try {
      return <SettlementInterface>JSON.parse(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Settlement', e.message);
    }
  }
}
