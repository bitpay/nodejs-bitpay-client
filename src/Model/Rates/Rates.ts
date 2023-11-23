import { RateClient } from '../../Client/RateClient';
import { BitPayExceptionProvider } from '../../Exceptions/BitPayExceptionProvider';
import {RateInterface} from "./Rate";

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
    const rates = await rateClient.getRates(null);
    this.rates = rates.getRates();
  }

  private static castRatesObj(ratesObj: RateInterface[] | string): RateInterface[] {
    try {
      if (typeof ratesObj === 'string' || ratesObj instanceof String) {
        ratesObj = JSON.parse(ratesObj.toString());
      }

      return <RateInterface[]>ratesObj;
    } catch (e: any) {
      BitPayExceptionProvider.throwGenericExceptionWithMessage(e.message);
      throw new Error()
    }
  }
}

export { Rates};
