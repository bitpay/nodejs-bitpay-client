/**
 * The type Wallet. Currencies are fiat currencies supported by BitPay.
 *
 * @see <a href="https://bitpay.com/api/#rest-api-resources-wallets">Wallets</a>
 */
import { CurrenciesInterface } from './Currencies';

export interface WalletInterface {
  key?: string;
  displayName?: string;
  avatar?: string;
  payPro?: boolean;
  currencies?: CurrenciesInterface[];
  image?: string;
}

export class Wallet implements WalletInterface {
  key?: string;
  displayName?: string;
  avatar?: string;
  payPro?: boolean;
  currencies?: CurrenciesInterface[];
  image?: string;
}
