export interface PayoutInfoInterface {

    name: string | null;
    account: string | null;
    routing: string | null;
    merchantEin: string | null;
    label: string | null;
    bankCountry: string | null;
    bank: string | null;
    swift: string | null;
    address: string | null;
    city: string | null;
    postal: string | null;
    sort: string | null;
    wire: string | null;
    bankName: string | null;
    bankAddress: string | null;
    bankAddress2: string | null;
    iban: string | null;
    additionalInformation: string | null;
    accountHolderName: string | null;
    accountHolderAddress: string | null;
    accountHolderAddress2: string | null;
    accountHolderPostalCode: string | null;
    accountHolderCity: string | null;
    accountHolderCountry: string | null;
}

export class PayoutInfo implements PayoutInfoInterface{

    name: string | null;
    account: string | null;
    routing: string | null;
    merchantEin: string | null;
    label: string | null;
    bankCountry: string | null;
    bank: string | null;
    swift: string | null;
    address: string | null;
    city: string | null;
    postal: string | null;
    sort: string | null;
    wire: string | null;
    bankName: string | null;
    bankAddress: string | null;
    bankAddress2: string | null;
    iban: string | null;
    additionalInformation: string | null;
    accountHolderName: string | null;
    accountHolderAddress: string | null;
    accountHolderAddress2: string | null;
    accountHolderPostalCode: string | null;
    accountHolderCity: string | null;
    accountHolderCountry: string | null;

    public constructor(){

    }
}
