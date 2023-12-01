import { CurrencyQrInterface } from './CurrencyQr';

/**
 * The type Currencies.
 *
 * @see <a href="https://bitpay.com/api/#rest-api-resources-wallets">Wallets</a>
 */
export interface CurrenciesInterface {
  code: string;
  p2p?: boolean;
  dappBrowser?: boolean;
  payPro?: boolean;
  qr?: CurrencyQrInterface;
  image?: string;
  withdrawalFee?: string;
  walletConnect?: boolean;
}

export class Currencies implements CurrenciesInterface {
  code: string;
  p2p?: boolean;
  dappBrowser?: boolean;
  payPro?: boolean;
  qr?: CurrencyQrInterface;
  image?: string;
  withdrawalFee?: string;
  walletConnect?: boolean;
}
