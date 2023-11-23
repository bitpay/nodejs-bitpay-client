export interface RefundInfoInterface {
  supportRequest?: string;
  currency: string;
  refundRequestEid?: string;
  amounts?: Record<string, number>;
}

export class RefundInfo implements RefundInfoInterface {
  supportRequest?: string;
  currency: string;
  refundRequestEid?: string ;
  amounts?: Record<string, number>;

  public constructor() {}
}
