import {ClientProvider} from "../ClientProvider";

class RateRequests {
  public getRate(): void {
    const client = ClientProvider.create();

    const rate = client.getRate('BTC', 'USD');

    const rates = client.getRates('BCH')
  }
}