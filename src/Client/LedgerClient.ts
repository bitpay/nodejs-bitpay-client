import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { LedgerEntryInterface, LedgerInterface } from '../Model';
import { Facade } from '../Facade';
import { BitPayExceptions as Exceptions } from '../index';

export class LedgerClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
  }

  /**
   * Retrieve a list of ledgers using the merchant facade.
   *
   * @return A list of Ledger objects populated with the currency and current balance of each one.
   * @throws LedgerQueryException LedgerQueryException class
   */
  public async getLedgers(): Promise<LedgerInterface[]> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.get('ledgers', params, true);
      return <LedgerInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.LedgerQuery(
        'failed to deserialize BitPay server response (Ledger) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Retrieve a list of ledgers by params
   *
   * @param currency
   * @param params
   * @returns ledgers
   * @throws LedgerQueryException
   */
  public async getEntries(currency: string, params: object): Promise<LedgerEntryInterface[]> {
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    try {
      const result = await this.bitPayClient.get('ledgers/' + currency, params, true);
      return <LedgerEntryInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.LedgerQuery(
        'failed to deserialize BitPay server response (Ledger) : ' + e.message,
        e.apiCode
      );
    }
  }
}
