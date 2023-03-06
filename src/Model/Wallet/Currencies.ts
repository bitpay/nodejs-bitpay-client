import { CurrencyQrInterface } from './CurrencyQr';

/**
 * The type Currencies.
 *
 * @see <a href="https://bitpay.com/api/#rest-api-resources-wallets">Wallets</a>
 */
export interface CurrenciesInterface {
  code: string | null;
  p2p: boolean | null;
  dappBrowser: boolean | null;
  payPro: boolean | null;
  qr: CurrencyQrInterface | null;
  image: string | null;
}

export class Currencies implements CurrenciesInterface {
  code: string | null;
  p2p: boolean | null;
  dappBrowser: boolean | null;
  payPro: boolean | null;
  qr: CurrencyQrInterface | null;
  image: string | null;
}
