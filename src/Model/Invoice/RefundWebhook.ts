export interface RefundWebhookInterface {
    id: string;
    invoice: string;
    supportRequest: string;
    status: string;
    amount: number;
    currency: string;
    lastRefundNotification: Date;
    refundFee: number;
    immediate: boolean;
    buyerPaysRefundFee: boolean;
    requestDate: Date;
}

export class RefundWebhook implements RefundWebhookInterface {
    id: string;
    invoice: string;
    supportRequest: string;
    status: string;
    amount: number;
    currency: string;
    lastRefundNotification: Date;
    refundFee: number;
    immediate: boolean;
    buyerPaysRefundFee: boolean;
    requestDate: Date;

    public constructor() {

    }
}