import { RateClient } from '../../Client/RateClient';
import { BitPayExceptionProvider } from '../../Exceptions/BitPayExceptionProvider';

interface RateInterface {
  Name: string;
  cryptoCode: string;
  currencyPair: string;
  code: string;
  rate: number;
}

class Rates {
  private rates: RateInterface[];

  public constructor(rates: RateInterface[]) {
    this.rates = Rates.castRatesObj(rates);
  }

  public getRates() {
    return this.rates;
  }

  public getRate(currencyCode: string): number {
    let val = 0;
    this.rates.forEach(function (rate) {
      if (rate.code === currencyCode) {
        val = rate.rate;
        return val;
      }
    });

    return val;
  }

  public async update(rateClient: RateClient) {
    const rates = await rateClient.getRates();
    this.rates = rates.getRates();
  }

  private static castRatesObj(ratesObj: RateInterface[] | string): RateInterface[] {
    try {
      if (typeof ratesObj === 'string' || ratesObj instanceof String) {
        ratesObj = JSON.parse(ratesObj.toString());
      }

      return <RateInterface[]>ratesObj;
    } catch (e) {
      BitPayExceptionProvider.throwGenericExceptionWithMessage(e.message);
    }
  }
}

export { Rates, RateInterface };
