export interface BuyerInterface {

    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
    notify: boolean | true;
    email: string | null;
}

export class Buyer implements BuyerInterface{

    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
    notify: boolean | true;
    email: string | null;

    public constructor(){

    }
}
