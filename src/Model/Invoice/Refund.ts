import {RefundParams} from "./RefundParams";

export interface RefundInterface {
    guid: string ;
    refundEmail: string ;
    amount: number ;
    currency: string ;
    token: string ;
    id: string ;
    requestDate: Date ;
    status: string ;
    params : RefundParams;
}

export class Refund implements RefundInterface {
    amount: number;
    currency: string;
    guid: string;
    id: string;
    params: RefundParams;
    refundEmail: string;
    requestDate: Date;
    status: string;
    token: string;

    public constructor() {

    }
}
