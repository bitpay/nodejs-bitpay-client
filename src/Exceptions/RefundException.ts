import BitPayException from './BitPayException';

export class RefundException implements BitPayException {
  public readonly message: string = 'An unexpected error occurred while trying to manage the refund';
  public readonly name: string = 'BITPAY-REFUND-GENERIC';
  public readonly code: number = 161;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the RefundException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default RefundException;
