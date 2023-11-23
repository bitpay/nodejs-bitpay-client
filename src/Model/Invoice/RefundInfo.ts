export interface RefundInfo {
  supportRequest: string;
  currency: string;
  amounts: Record<string, number>;
}
