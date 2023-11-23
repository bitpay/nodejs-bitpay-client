export interface PayoutInfoInterface {
  name?: string;
  account?: string;
  routing?: string;
  merchantEin?: string;
  label?: string;
  bankCountry?: string;
  bank?: string;
  swift?: string;
  address?: string;
  city?: string;
  postal?: string;
  sort?: string;
  wire?: boolean;
  bankName?: string;
  bankAddress?: string;
  bankAddress2?: string;
  iban?: string;
  additionalInformation?: string;
  accountHolderName?: string;
  accountHolderAddress?: string;
  accountHolderAddress2?: string;
  accountHolderPostalCode?: string;
  accountHolderCity?: string;
  accountHolderCountry?: string;
}

export class PayoutInfo implements PayoutInfoInterface {
  name?: string;
  account?: string;
  routing?: string;
  merchantEin?: string;
  label?: string;
  bankCountry?: string;
  bank?: string;
  swift?: string;
  address?: string;
  city?: string;
  postal?: string;
  sort?: string;
  wire?: boolean;
  bankName?: string;
  bankAddress?: string;
  bankAddress2?: string;
  iban?: string;
  additionalInformation?: string;
  accountHolderName?: string;
  accountHolderAddress?: string;
  accountHolderAddress2?: string;
  accountHolderPostalCode?: string;
  accountHolderCity?: string;
  accountHolderCountry?: string;

  public constructor() {}
}
