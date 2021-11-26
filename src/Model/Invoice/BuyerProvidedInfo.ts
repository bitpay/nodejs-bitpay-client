export interface BuyerProvidedInfoInterface {
    name: string;
    phoneNumber: string;
    selectedTransactionCurrency: string;
    emailAddress: string;
    selectedWallet: string;
}

export class BuyerProvidedInfo implements BuyerProvidedInfoInterface{
    name: string;
    phoneNumber: string;
    selectedTransactionCurrency: string;
    emailAddress: string;
    selectedWallet: string;

    public constructor(){

    }
}
