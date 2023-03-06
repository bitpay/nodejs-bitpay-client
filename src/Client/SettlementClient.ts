import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { SettlementInterface } from '../Model/Settlement/Settlement';
import { BitPayExceptions as Exceptions, Facade } from '../index';

export class SettlementClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
  }

  public async get(settlementId: string): Promise<SettlementInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.get(
        'settlements/' + settlementId,
        params,
        true,
      );
      return <SettlementInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.SettlementQuery(
        'failed to deserialize BitPay server response (Settlement) : ' +
          e.message,
        e.apiCode,
      );
    }
  }

  public async getSettlements(params: {}): Promise<SettlementInterface[]> {
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    try {
      const result = await this.bitPayClient.get('settlements', params, true);
      return <SettlementInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.SettlementQuery(
        'failed to deserialize BitPay server response (Settlement) : ' +
          e.message,
        e.apiCode,
      );
    }
  }

  public async getReconciliationReport(
    settlementId: string,
    token: string,
  ): Promise<SettlementInterface> {
    const params = { token: token };

    try {
      const result = await this.bitPayClient.get(
        'settlements/' + settlementId + '/reconciliationReport',
        params,
        true,
      );
      return <SettlementInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.SettlementQuery(
        'failed to deserialize BitPay server response (Settlement) : ' +
          e.message,
        e.apiCode,
      );
    }
  }
}
