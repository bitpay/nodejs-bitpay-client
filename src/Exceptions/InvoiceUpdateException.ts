import InvoiceException from './InvoiceException';

export class InvoiceUpdateException implements InvoiceException {
  public readonly message: string = 'Failed to create invoice';
  public readonly name: string = 'BITPAY-INVOICE-UPDATE';
  public readonly code: number = 104;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the InvoiceUpdateException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default InvoiceUpdateException;
