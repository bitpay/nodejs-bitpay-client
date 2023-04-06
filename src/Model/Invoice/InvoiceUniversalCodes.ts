export interface InvoiceUniversalCodesInterface {
    paymentString: string | null;
    verificationLink: string | null;
}

export class InvoiceUniversalCodes implements InvoiceUniversalCodesInterface {
    paymentString: string | null;
    verificationLink: string | null;
}