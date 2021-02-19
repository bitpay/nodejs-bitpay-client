import {Currency} from "../../Currency";
import BitPayException from "../../Exceptions/BitPayException";
import {Item} from "./Item";

export interface BillInterface {

    currency: string | null;
    token: string | null;
    email: string | null;
    items: Item[] | [];
    number: string | null;
    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
    dueDate: string | null;
    passProcessingFee: number | null;
    status: string | null;
    url: string | null;
    createDate: string | null;
    id: string | null;
    merchant: string | null;
}

export class Bill implements BillInterface {

    address1: string | null;
    address2: string | null;
    cc: string[] | [];
    city: string | null;
    country: string | null;
    createDate: string | null;
    currency: string | null;
    dueDate: string | null;
    email: string | null;
    id: string | null;
    items: Item[] | [];
    merchant: string | null;
    name: string | null;
    number: string | null;
    passProcessingFee: number | null;
    phone: string | null;
    state: string | null;
    status: string | null;
    token: string | null;
    url: string | null;
    zip: string | null;

    /**
     * Constructor, create a minimal request Bill object.
     *
     * @param number   A string for tracking purposes.
     * @param currency The three digit currency type used to compute the bill's amount.
     * @param email    The email address of the receiver for this bill.
     * @param items    The list of itens to add to this bill.
     */
    public constructor(number: string, currency: string, email: string, items: Item[]) {
        this.number = number;
        this.setCurrency(currency);
        this.email = email;
        this.items = items;
    }

    setCurrency(_currency:string) {
        if (!Currency.isValid(_currency))
            throw new BitPayException(null, "Error: currency code must be a type of Model.Currency", null);

        this.currency = _currency;
    }
}

export default Item;
