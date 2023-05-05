import BillException from './BillException';

export class BillQueryException implements BillException {
  public readonly message: string = 'Failed to retrieve bill';
  public readonly name: string = 'BITPAY-BILL-GET';
  public readonly code: number = 113;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the BillQueryException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default BillQueryException;
