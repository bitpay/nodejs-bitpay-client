import { InvoiceInterface, RateInterface, Rates } from '../Model';
import { BitPayClient } from './BitPayClient';
import { BitPayExceptions as Exceptions } from '../index';

export class RateClient {
  private bitPayClient: BitPayClient;

  constructor(bitPayClient: BitPayClient) {
    this.bitPayClient = bitPayClient;
  }

  public async getRate(
    baseCurrency: string,
    currency: string,
  ): Promise<RateInterface> {
    let uri = currency
      ? 'rates/' + baseCurrency + '/' + currency
      : '/' + baseCurrency;
    try {
      const result = await this.bitPayClient.get(uri, null, false);
      return <RateInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RateQuery(e);
    }
  }

  public async getRates(currency: string = null): Promise<Rates> {
    const uri = currency ? 'rates/' + currency : 'rates';

    try {
      const result = await this.bitPayClient.get(uri, null, false);
      return new Rates(result);
    } catch (e) {
      throw new Exceptions.RateQuery(e);
    }
  }
}
