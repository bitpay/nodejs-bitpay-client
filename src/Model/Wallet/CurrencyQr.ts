/**
 * The type Currency qr.
 *
 * @see <a href="https://bitpay.com/api/#rest-api-resources-wallets">Wallets</a>
 */
export interface CurrencyQrInterface {
  type: string | null;
  collapsed: string | null;
}
export class CurrencyQr implements CurrencyQrInterface {
  type: string | null;
  collapsed: string | null;
}
