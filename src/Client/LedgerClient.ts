import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { LedgerEntryInterface, LedgerInterface } from '../Model';
import { Facade } from '../Facade';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';

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
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async getLedgers(): Promise<LedgerInterface[]> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    const result = await this.bitPayClient.get('ledgers', params, true);

    try {
      return <LedgerInterface[]>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Ledger', e.message);
      throw new Error();
    }
  }

  /**
   * Retrieve a list of ledgers by params
   *
   * @param currency
   * @param params
   * @returns ledgers
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async getEntries(currency: string, params: object): Promise<LedgerEntryInterface[]> {
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    const result = await this.bitPayClient.get('ledgers/' + currency, params, true);

    try {
      return <LedgerEntryInterface[]>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Ledger', e.message);
      throw new Error();
    }
  }
}
