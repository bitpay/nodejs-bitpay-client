import { RefundInfo } from './RefundInfo';

export interface InvoiceDataInterface {
  price: number;
  orderId?: string;
  date?: string;
  currency?: string;
  transactionCurrency?: string;
  payoutPercentage?: Record<string, number>;
  refundInfo?: RefundInfo;
}

export class InvoiceData implements InvoiceDataInterface {
  price: number;
  orderId?: string;
  date?: string;
  currency?: string;
  transactionCurrency?: string;
  payoutPercentage?: Record<string, number>;
  refundInfo?: RefundInfo;

  public constructor() {}
}
