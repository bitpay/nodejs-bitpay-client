export interface BuyerFieldsInterface {
  buyerName?: string;
  buyerAddress1?: string;
  buyerAddress2?: string;
  buyerCity?: string;
  buyerState?: string;
  buyerZip?: string;
  buyerCountry?: string;
  buyerPhone?: string;
  buyerNotify?: boolean;
  buyerEmail?: string;
}

export class BuyerFields implements BuyerFields {
  buyerName?: string;
  buyerAddress1?: string;
  buyerAddress2?: string;
  buyerCity?: string;
  buyerState?: string;
  buyerZip?: string;
  buyerCountry?: string;
  buyerPhone?: string;
  buyerNotify?: boolean;
  buyerEmail?: string;

  public constructor() {}
}
