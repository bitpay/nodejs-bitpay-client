import { BitPayClient } from './BitPayClient';
import { CurrencyInterface } from '../Model/Currency/Currency';

export class CurrencyClient {
  private bitPayClient: BitPayClient;

  public constructor(bitPayClient: BitPayClient) {
    this.bitPayClient = bitPayClient;
  }

  /**
   * Retrieve the Currency Info
   *
   * @param currencyCode
   * @returns CurrencyInterface|null
   */
  public async getCurrencyInfo(currencyCode: string): Promise<CurrencyInterface | null> {
    let currencyInfo = null;

    await this.bitPayClient.get('currencies', null, false).then((ratesData) => {
      const data = <[]>JSON.parse(ratesData);
      data.some((element) => {
        currencyInfo = element;
        if (element['code'] == currencyCode) {
          currencyInfo = element;
          return true;
        }
      });
    });
    return currencyInfo;
  }
}
