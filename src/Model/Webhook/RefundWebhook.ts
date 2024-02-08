export interface RefundWebhook {
  amount?: number;
  buyerPaysRefundFee?: boolean;
  currency?: string;
  id?: string;
  immediate?: boolean;
  invoice?: string;
  lastRefundNotification?: string;
  refundFee?: number;
  requestDate?: string;
  status?: string;
  supportRequest?: string;
  reference?: string;
  guid?: string;
  refundAddress?: string;
  type?: string;
  txid?: string;
  transactionCurrency?: string;
  transactionAmount?: number;
  transactionRefundFee?: number;
}
