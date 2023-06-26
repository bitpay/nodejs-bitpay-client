export interface RefundInfoInterface {
  supportRequest: string | null;
  currency: string | null;
  refundRequestEid: string | null;
  amounts: [];
}

export class RefundInfo implements RefundInfoInterface {
  supportRequest: string | null;
  currency: string | null;
  refundRequestEid: string | null;
  amounts: [];

  public constructor() {}
}
