/**
 * The type Currency qr.
 *
 * @see <a href="https://bitpay.com/api/#rest-api-resources-wallets">Wallets</a>
 */
export interface CurrencyQrInterface {
  type: string;
  collapsed?: string;
}
export class CurrencyQr implements CurrencyQrInterface {
  type: string;
  collapsed?: string;
}
