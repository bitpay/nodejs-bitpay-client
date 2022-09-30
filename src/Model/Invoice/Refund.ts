import {RefundParams} from "./RefundParams";

export interface RefundInterface {
    guid: string;
    refundEmail: string;
    amount: number;
    currency: string;
    token: string;
    id: string;
    requestDate: Date;
    status: string;
    invoice: string;
    supportRequest: string;
    refundAddress: string;
    txid: string;
    type: string;
    reference?: string;
    transactionCurrency: string;
    transactionAmount: number;
    transactionRefundFee: number;
    lastRefundNotification: Date;
    notificationURL: string;
    refundFee: number;
    immediate: boolean
    buyerPaysRefundFee: boolean;
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
    invoice: string;
    supportRequest: string;
    refundAddress: string;
    txid: string;
    type: string;
    reference?: string;
    transactionCurrency: string;
    transactionAmount: number;
    transactionRefundFee: number;
    lastRefundNotification: Date;
    notificationURL: string;
    refundFee: number;
    immediate: boolean
    buyerPaysRefundFee: boolean;

    public constructor() {

    }
}
