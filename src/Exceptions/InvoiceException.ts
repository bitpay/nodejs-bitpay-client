import BitPayException from './BitPayException';

export class InvoiceException implements BitPayException {
  public readonly message: string = 'An unexpected error occurred while trying to manage the invoice';
  public readonly name: string = 'BITPAY-INVOICE-GENERIC';
  public readonly code: number = 101;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the InvoiceException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default InvoiceException;
