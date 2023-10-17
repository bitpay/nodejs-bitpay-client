import { RateInterface, Rates } from '../Model';
import { BitPayClient } from './BitPayClient';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';

export class RateClient {
  private bitPayClient: BitPayClient;

  constructor(bitPayClient: BitPayClient) {
    this.bitPayClient = bitPayClient;
  }

  /**
   * Retrieve the rate for a cryptocurrency / fiat pair
   *
   * @param baseCurrency The cryptocurrency for which you want to fetch the fiat-equivalent rate.
   * @param currency The fiat currency for which you want to fetch the baseCurrency rate
   * @returns Rate  A Rate object populated with the currency rate for the requested baseCurrency.
   * @throws BitPayGenericException BitPayGenericException class
   * @throws BitPayApiException BitPayApiException class
   */
  public async getRate(baseCurrency: string, currency: string): Promise<RateInterface> {
    const uri = currency ? 'rates/' + baseCurrency + '/' + currency : '/' + baseCurrency;
    const result = await this.bitPayClient.get(uri, null, false);

    try {
      return <RateInterface>JSON.parse(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Rate', e.message);
    }
  }

  /**
   * Retrieve the exchange rate table maintained by BitPay.  See https://bitpay.com/bitcoin-exchange-rates.
   *
   * @param currency
   * @returns Rates A Rates object populated with the currency rates for the requested baseCurrency.
   * @throws BitPayGenericException BitPayGenericException class
   * @throws BitPayApiException BitPayApiException class
   */
  public async getRates(currency: string = null): Promise<Rates> {
    const uri = currency ? 'rates/' + currency : 'rates';

    const result = await this.bitPayClient.get(uri, null, false);

    try {
      return new Rates(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Rate', e.message);
    }
  }
}
