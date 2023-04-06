export interface InvoiceBuyerProvidedInfoInterface {
  name: string | null;
  phoneNumber: string | null;
  sms: string | null;
  smsVerified: boolean | null;
  selectedWallet: string | null;
  selectedTransactionCurrency: string | null;
  emailAddress: string | null;
}

export class InvoiceBuyerProvidedInfo implements InvoiceBuyerProvidedInfoInterface {
  name: string | null;
  phoneNumber: string | null;
  sms: string | null;
  smsVerified: boolean | null;
  selectedWallet: string | null;
  selectedTransactionCurrency: string | null;
  emailAddress: string | null;

  public constructor() {}
}
