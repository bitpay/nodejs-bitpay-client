/**
 * The type Wallet. Currencies are fiat currencies supported by BitPay.
 *
 * @see <a href="https://bitpay.com/api/#rest-api-resources-wallets">Wallets</a>
 */
import {CurrenciesInterface} from "./Currencies";

export interface WalletInterface {
    key: string | null;
    displayName: string | null;
    avatar: string | null;
    payPro: boolean | null;
    currencies: CurrenciesInterface[] | null;
    image: string | null;
}


export class Wallet implements WalletInterface {
    key: string | null;
    displayName: string | null;
    avatar: string | null;
    payPro: boolean | null;
    currencies: CurrenciesInterface[] | null;
    image: string | null;
}
