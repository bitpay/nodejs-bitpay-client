export interface RefundInfo {
    supportRequest: string;
    currency: string;
    amounts: Array<[string, number]>
}
