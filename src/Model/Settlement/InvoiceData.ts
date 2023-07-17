import { RefundInfo } from './RefundInfo';

export interface InvoiceDataInterface {
  orderId: string | null;
  date: number;
  price: number;
  currency: string | null;
  transactionCurrency: string | null;
  payoutPercentage: number;
  refundInfo: RefundInfo;
}

export class InvoiceData implements InvoiceDataInterface {
  orderId: string | null;
  date: number;
  price: number;
  currency: string | null;
  transactionCurrency: string | null;
  payoutPercentage: number;
  refundInfo: RefundInfo;

  public constructor() {}
}
