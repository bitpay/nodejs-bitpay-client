import {Item} from "./Item";

export interface BillDataInterface {
    emailBill: boolean | true;
    cc: [] | [];
    number: string | null;
    currency: string | null;
    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    email: string | null;
    phone: string | null;
    dueDate: string | null;
    passProcessingFee: boolean | false;
    items: Item[] | [];
    merchant: string | null;
}

export class BillData implements BillDataInterface {
    emailBill: boolean | true;
    cc: [] | [];
    number: string | null;
    currency: string | null;
    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    email: string | null;
    phone: string | null;
    dueDate: string | null;
    passProcessingFee: boolean | false;
    items: Item[] | [];
    merchant: string | null;

    public constructor(currency: string, email: string, dueDate: string, items: any[]) {
        this.currency = currency;
        this.email = email;
        this.dueDate = dueDate;
        this.items = items;
    }
}
