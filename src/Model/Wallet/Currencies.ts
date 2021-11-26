import {CurrencyQr} from "./CurrencyQr";

export interface CurrenciesInterface {
    code: string;
    p2p: boolean;
    dappBrowser: boolean;
    payPro: boolean;
    qr: CurrencyQr;
    withdrawalFee: string;
    walletConnect: boolean;
}

export class Currencies implements CurrenciesInterface{
    code: string;
    p2p: boolean;
    dappBrowser: boolean;
    payPro: boolean;
    qr: CurrencyQr;
    withdrawalFee: string;
    walletConnect: boolean;

    public constructor(){

    }
}
