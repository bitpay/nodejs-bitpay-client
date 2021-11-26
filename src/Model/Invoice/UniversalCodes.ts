export interface UniversalCodesInterface {
    paymentString: string;
    verificationLink: string;
}

export class UniversalCodes implements UniversalCodesInterface{
    paymentString: string;
    verificationLink: string;

    public constructor(){

    }
}
