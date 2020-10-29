import {RefundParams} from "./RefundParams";

export interface Refund {
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
