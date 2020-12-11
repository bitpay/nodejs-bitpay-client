export interface BuyerInterface {

    name: string;
    address1: string;
    address2: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    email: string;
    phone: string;
    notify: boolean;
}

export class Buyer implements BuyerInterface{
    address1: string;
    address2: string;
    country: string;
    email: string;
    locality: string;
    name: string;
    notify: boolean;
    phone: string;
    postalCode: string;
    region: string;

    public constructor(){

    }
}
