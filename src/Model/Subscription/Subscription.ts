import {BillData} from "./BillData";

export interface SubscriptionInterface {
    billData: BillData | null;
    schedule: string | null;
    nextDelivery: string | null;
    createdDate: string | null;
    token: string | null;
    id: string | null;
    status: string | null;
}

export class Subscription implements SubscriptionInterface {
    billData: BillData | null;
    schedule: string | null;
    nextDelivery: string | null;
    createdDate: string | null;
    token: string | null;
    id: string | null;
    status: string | null;

    public constructor() {
    }
}
