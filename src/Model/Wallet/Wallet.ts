import {Currencies} from "./Currencies";

export interface WalletInterface {
    key: string;
    displayName: string;
    avatar: string;
    payPro: boolean;
    currencies: Currencies;
}

export class Wallet implements WalletInterface{
    key: string;
    displayName: string;
    avatar: string;
    payPro: boolean;
    currencies: Currencies;

    public constructor(){

    }
}