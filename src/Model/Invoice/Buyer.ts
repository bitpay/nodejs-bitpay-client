export interface BuyerInterface {
  email?: string;
  name?: string;
  address1?: string;
  address2?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  notify?: boolean;
}

export class Buyer implements BuyerInterface {
  email?: string;
  address1?: string;
  address2?: string;
  country?: string;
  locality?: string;
  name?: string;
  notify?: boolean;
  phone?: string;
  postalCode?: string;
  region?: string;

  public constructor() {}
}
